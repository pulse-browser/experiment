// @ts-check
import { lazyESModuleGetters } from 'resource://app/modules/TypedImportUtils.sys.mjs'

const lazy = lazyESModuleGetters({
  AddonManager: 'resource://gre/modules/AddonManager.sys.mjs',
  Extension: 'resource://gre/modules/Extension.sys.mjs',
  ExtensionData: 'resource://gre/modules/Extension.sys.mjs',
  ExtensionUtils: 'resource://gre/modules/ExtensionUtils.sys.mjs',
  FileUtils: 'resource://gre/modules/FileUtils.sys.mjs',
})

/**
 * @param {Function} script
 * @returns {string}
 */
function serializeFunction(script) {
  // Serialization of object methods doesn't include `function` anymore.
  const method = /^(async )?(?:(\w+)|"(\w+)\.js")\(/

  let code = script.toString()
  let match = code.match(method)
  if (match && match[2] !== 'function') {
    code = code.replace(method, '$1function $2$3(')
  }
  return code
}

/**
 * @param {string | Function | Array<string>} script
 * @returns {string}
 */
function serializeScript(script) {
  if (Array.isArray(script)) {
    return Array.from(script, serializeScript).join(';')
  }

  if (typeof script !== 'function') return script
  return `(${serializeFunction(script)})();`
}

/**
 * @param {Partial<import("resource://app/modules/ExtensionTestUtils.sys.mjs").ExtStaticManifest>} data
 * @returns {Record<string, string>}
 */
function generateFiles(data) {
  const files = { ...data.files }

  /** @type {Partial<import("resource://app/modules/ExtensionTestUtils.sys.mjs").WebExtensionManifest>} */
  const manifest = data.manifest || {}

  manifest.name ??= 'Generated extension'
  manifest.manifest_version ??= 2
  manifest.version ??= '1.0'

  if (data.background) {
    const bgScript = `${Services.uuid.generateUUID().number}.js`
    files[bgScript] = data.background
    manifest.background = { scripts: [bgScript], persistent: true }
  }

  files['manifest.json'] = JSON.stringify(manifest, null, 2)
  return files
}

/**
 * @param {Record<string, string>} files
 * @returns {nsIFileType}
 */
function generateZipFile(files) {
  const baseName = 'generated-extension.xpi'
  const ZipWriter = Components.Constructor(
    '@mozilla.org/zipwriter;1',
    'nsIZipWriter',
  )
  const writer = new ZipWriter()

  const file = new lazy.FileUtils.File(
    PathUtils.join(PathUtils.tempDir, baseName),
  )
  file.createUnique(Ci.nsIFile.NORMAL_FILE_TYPE, lazy.FileUtils.PERMS_FILE)

  const { MODE_WRONLY, MODE_TRUNCATE } = lazy.FileUtils
  writer.open(file, MODE_WRONLY | MODE_TRUNCATE)

  const time = Date.now() * 1000

  for (const filename in files) {
    const contents = files[filename]
    const buffer = new TextEncoder().encode(contents).buffer

    const stream = Cc[
      '@mozilla.org/io/arraybuffer-input-stream;1'
    ].createInstance(Ci.nsIArrayBufferInputStream)
    stream.setData(buffer, 0, buffer.byteLength)

    const components = filename.split('/')
    let path = ''
    for (const component of components.slice(0, -1)) {
      path += component + '/'
      if (!writer.hasEntry(path)) {
        writer.addEntryDirectory(path, time, false)
      }
    }

    writer.addEntryStream(filename, time, 0, stream, false)
  }

  writer.close()
  return file
}

/**
 * @param {Partial<import("resource://app/modules/ExtensionTestUtils.sys.mjs").ExtStaticManifest>} data
 * @returns {nsIFileType}
 */
function generateXPI(data) {
  const files = generateFiles(data)
  return generateZipFile(files)
}

/**
 * @param {Partial<import("resource://app/modules/ExtensionTestUtils.sys.mjs").ExtStaticManifest>} data
 * @returns {import('resource://gre/modules/Extension.sys.mjs').Extension}
 */
function generate(data) {
  const file = generateXPI(data)

  lazy.ExtensionUtils.flushJarCache(file.path)
  Services.ppmm.broadcastAsyncMessage('Extension:FlushJarCache', {
    path: file.path,
  })

  const fileURI = Services.io.newFileURI(file)
  const jarURI = Services.io.newURI(`jar:${fileURI.spec}!/`)

  const id = Services.uuid.generateUUID().number
  // TODO: Allow the manifest to specify signed states
  const signedState = lazy.AddonManager.SIGNEDSTATE_SIGNED

  return new lazy.Extension(
    {
      id,
      resourceURI: jarURI,
      cleanupFile: file,
      signedState,
      temporarilyInstalled: true,
      isPrivleged: false,
      TEST_NO_ADDON_MANAGER: true,
      TEST_NO_DELAYED_STARTUP: true,
    },
    'ADDON_INSTALL',
    undefined,
  )
}

/**
 * @template T
 * @template R
 *
 * @param {Record<string, T>} obj
 * @param {(value: T, key: string, index: number) => R} fn
 *
 * @returns {Record<string, R>}
 */
const objectMap = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]))

/**
 * @typedef {import("resource://app/modules/ExtensionTestUtils.sys.mjs").IExtensionTestUtils} IExtensionTestUtils
 */

/**
 * @implements {IExtensionTestUtils}
 */
class ExtensionTestUtilsImpl {
  /**
   * @template {import('resource://app/modules/zora.sys.mjs').IAssert} A
   *
   * @param {Partial<import("resource://app/modules/ExtensionTestUtils.sys.mjs").ExtManifest>} definition
   * @param {import('resource://app/modules/ExtensionTestUtils.sys.mjs').AddonMiddleware<A>} assert
   *
   * @returns {import('resource://app/modules/ExtensionTestUtils.sys.mjs').ExtensionWrapper}
   */
  loadExtension(definition, assert) {
    const extension = generate({
      ...definition,
      files: objectMap(definition.files || {}, serializeScript),
      background:
        definition.background && serializeScript(definition.background),
    })

    function handleTestResults(kind, pass, msg, ...args) {
      if (kind == 'test-eq') {
        let [expected, actual] = args
        assert.ok(pass, `${msg} - Expected: ${expected}, Actual: ${actual}`)
      } else if (kind == 'test-log') {
        console.info(msg)
      } else if (kind == 'test-result') {
        assert.ok(pass, msg)
      }
    }

    extension.on('test-result', handleTestResults)
    extension.on('test-eq', handleTestResults)
    extension.on('test-log', handleTestResults)
    extension.on('test-done', (...args) =>
      console.warn('Not Implemented', ...args),
    )

    extension.on('test-message', (...args) => console.log('message', ...args))

    return {
      extension,
      async startup() {
        try {
          /** @type {Promise<[string, string]>} */
          const startupPromise = new Promise((res) =>
            extension.once('startup', (_eventName, ext) =>
              res([ext.id, ext.uuid]),
            ),
          )

          const extensionData = new lazy.ExtensionData(extension.rootURI)
          await extensionData.loadManifest()
          try {
            await extensionData.initAllLocales()
          } catch {
            /* Ignore */
          }
          await extension.startup()
          return await startupPromise
        } catch (e) {
          assert.fail(`Errored: ${e}`)
        }
      },
      async unload() {
        await extension.shutdown()
        return await extension._uninstallPromise
      },

      sendMsg(msg) {
        extension.testMessage(msg)
      },
      async awaitMsg(msg) {
        return new Promise((res) => {
          const callback = (_, event) => {
            if (event == msg) {
              extension.off('test-message', callback)
              res(void 0)
            }
          }

          extension.on('test-message', callback)
        })
      },
    }
  }
}

export const ExtensionTestUtils = new ExtensionTestUtilsImpl()

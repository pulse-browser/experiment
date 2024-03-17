// @ts-check

/**
 * Allows you to lazy-import in a type safe way
 *
 * !!! WARNING !!!
 * You can only import each module once each bundle, otherwise
 * gecko gives up and behaves strangly
 *
 * @template {Partial<MozESMExportFile>} Modules
 * @param {Modules} modules the modules you want to import
 * @returns {{[Key in keyof Modules]: MozESMExportType[Key]}}
 */
export function lazyESModuleGetters(modules) {
  const lazy = {}
  ChromeUtils.defineESModuleGetters(lazy, modules)
  // @ts-expect-error Typescript doesn't properly understand magic
  return lazy
}

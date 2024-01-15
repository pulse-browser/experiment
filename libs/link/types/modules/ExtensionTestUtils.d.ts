/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/// <reference types="@types/firefox-webext-browser" />

declare module 'resource://app/modules/ExtensionTestUtils.sys.mjs' {
  import type { IAssert } from 'zora'

  type AddonWrapper = unknown
  type ContentPage = unknown

  export class ExtensionWrapper {
    addon: AddonWrapper
    addonPromise: Promise<AddonWrapper>
    cleanupFiles: nsIFileType[]

    destroy()
    attachExtension(extension)
    clearMessageQueues()
    handleResult(kind: string, pass, nsg, expected, actual)
    handleMessage(kind: string, msg, ...args)

    awaitStartup(): Promise<AddonWrapper>
    awaitBackgroundStarted(): Promise<[AddonWrapper, unknown]>
    startup(): Promise<void>

    terminateBackground(...args): Promise<unknown>
    wakeupBackground(): Promise<unknown>
    sendMessage(...args): Promise<unknown>
    awaitFInish(msg): Promise<unknown>

    checkMessages(): void
    checkDuplicateListener(msg): void
    awaitMessage(msg): Promise<void>
    onMessage(msg, callback): void
  }

  export type ExtensionTestAssertions = {
    getPersistentListeners(extWrapper, apiNs, apiEvent)
    assertPersistentListeners(
      extWrapper,
      apiNs,
      apiEvent,
      options: { primed; persisted: boolean; primedListenersCount },
    )
  }

  /* eslint @typescript-eslint/ban-types: 0 */
  export type ExtSerializableScript = string | Function | Array<string>
  export type ExtManifest = {
    files: Record<string, ExtSerializableScript>
    background: ExtSerializableScript
    manifest: browser._manifest.WebExtensionManifest
  }

  export const ExtensionTestUtils: {
    getBackgroundServiceWorkerEnabled(): boolean
    isInBackgroundServiceWorkerTests(): boolean

    testAssertions: ExtensionTestAssertions

    loadExtension(
      ext: Partial<ExtManifest>,
      assert: IAssert,
    ): { extension: ExtensionWrapper; cleanupFn: () => void }

    failOnSchemaWarnings(warningsAsErrors?: boolean): void
  }
}

declare interface MozESMExportFile {
  ExtensionTestUtils: 'resource://app/modules/ExtensionTestUtils.sys.mjs'
}

declare interface MozESMExportType {
  ExtensionTestUtils: typeof import('resource://app/modules/ExtensionTestUtils.sys.mjs').ExtensionTestUtils
}

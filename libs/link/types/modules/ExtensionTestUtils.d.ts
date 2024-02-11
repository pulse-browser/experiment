/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/// <reference types="@types/firefox-webext-browser" />

declare module 'resource://app/modules/ExtensionTestUtils.sys.mjs' {
  import type { IDefaultAssert } from 'resource://app/modules/TestManager.sys.mjs'
  import type { Extension } from 'resource://gre/modules/Extension.sys.mjs'

  export type WebExtensionManifest = browser._manifest.WebExtensionManifest

  /* eslint @typescript-eslint/ban-types: 0 */
  export type ExtSerializableScript = string | Function | Array<string>
  export type ExtManifest = {
    files: Record<string, ExtSerializableScript>
    background: ExtSerializableScript
    manifest: browser._manifest.WebExtensionManifest
  }

  export type ExtensionWrapper = {
    extension: Extension
    startup(): Promise<[string, string]>
    unload(): Promise<unknown>

    sendMsg(msg: string): void
    awaitMsg(msg: string): Promise<void>
  }

  /**
   * Similar in structure to {@link ExtManifest}, except only allowing strings
   * to be provided
   */
  export type ExtStaticManifest = {
    files: Record<string, string>
    background: string
    manifest: browser._manifest.WebExtensionManifest
  }

  export interface IExtensionTestUtils {
    loadExtension(
      definition: Partial<ExtManifest>,
      assert: IDefaultAssert,
    ): ExtensionWrapper
  }

  const ExtensionTestUtils: IExtensionTestUtils
}

declare interface MozESMExportFile {
  ExtensionTestUtils: 'resource://app/modules/ExtensionTestUtils.sys.mjs'
}

declare interface MozESMExportType {
  ExtensionTestUtils: typeof import('resource://app/modules/ExtensionTestUtils.sys.mjs').ExtensionTestUtils
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/// <reference types="gecko-types" />

declare module 'resource://app/modules/FaviconLoader.sys.mjs' {
  export const FaviconLoader: typeof import('./modules/FaviconLoader').FaviconLoader
}

declare module 'resource://app/modules/TypedImportUtils.sys.mjs' {
  export const lazyESModuleGetters: typeof import('./modules/TypedImportUtils').lazyESModuleGetters
}

declare interface MozESMExportFile {
  TypedImportUtils: 'resource://app/modules/TypedImportUtils.sys.mjs'
}

declare interface MozESMExportType {
  TypedImportUtils: typeof import('./modules/TypedImportUtils')
}

declare var Cr: Record<string, nsresult>

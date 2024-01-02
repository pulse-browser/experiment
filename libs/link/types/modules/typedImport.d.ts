/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

declare module 'resource://app/modules/TypedImportUtils.sys.mjs' {
  export function lazyESModuleGetters<
    Modules extends Partial<MozESMExportFile>,
  >(
    modules: Modules,
    // @ts-expect-error - Cannot guarantee overlapping key type
  ): { [Key in keyof Modules]: MozESMExportType[Key] }
}

declare interface MozESMExportFile {
  lazyESModuleGetters: 'resource://app/modules/TypedImportUtils.sys.mjs'
}

declare interface MozESMExportType {
  lazyESModuleGetters: typeof import('resource://app/modules/TypedImportUtils.sys.mjs').lazyESModuleGetters
}

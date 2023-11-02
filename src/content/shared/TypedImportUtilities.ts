/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export function lazyESModuleGetters<Modules extends Partial<MozESMExportFile>>(
  modules: Modules,
  // @ts-ignore
): { [Key in keyof Modules]: MozESMExportType[Key] } {
  const lazy = {} as any

  ChromeUtils.defineESModuleGetters(lazy, modules)

  return lazy
}

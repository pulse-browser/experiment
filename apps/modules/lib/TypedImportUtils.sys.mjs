/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/// @ts-check
/// <reference types="@browser/link" />

/** @type {typeof import('resource://app/modules/TypedImportUtils.sys.mjs').lazyESModuleGetters} */
export const lazyESModuleGetters = (modules) => {
  /** @type {any} */
  const lazy = {}
  ChromeUtils.defineESModuleGetters(lazy, modules)
  return lazy
}

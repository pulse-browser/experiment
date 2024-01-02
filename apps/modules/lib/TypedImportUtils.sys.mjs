/// @ts-check
/// <reference types="@browser/link" />

/** @type {typeof import('resource://app/modules/TypedImportUtils.sys.mjs').lazyESModuleGetters} */
export const lazyESModuleGetters = (modules) => {
  /** @type {any} */
  const lazy = {}
  ChromeUtils.defineESModuleGetters(lazy, modules)
  return lazy
}

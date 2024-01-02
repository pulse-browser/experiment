export function lazyESModuleGetters<Modules extends Partial<MozESMExportFile>>(
  modules: Modules,
  // @ts-expect-error - Cannot guarantee overlapping key type
): { [Key in keyof Modules]: MozESMExportType[Key] } {
  // @ts-expect-error - Cannot guarantee overlapping key type
  const lazy = {} as { [Key in keyof Modules]: MozESMExportType[Key] }

  ChromeUtils.defineESModuleGetters(lazy, modules)

  return lazy
}

export const lazy = lazyESModuleGetters({
  AppConstants: 'resource://gre/modules/AppConstants.sys.mjs',
  PlacesUtils: 'resource://gre/modules/PlacesUtils.sys.mjs',
  Bookmarks: 'resource://gre/modules/Bookmarks.sys.mjs',
  History: 'resource://gre/modules/History.sys.mjs',
})

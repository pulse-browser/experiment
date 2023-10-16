export function lazyESModuleGetters<Modules extends Partial<MozESMExportFile>>(
  modules: Modules,
  // @ts-ignore
): { [Key in keyof Modules]: MozESMExportType[Key] } {
  const lazy = {} as any

  ChromeUtils.defineESModuleGetters(lazy, modules)

  return lazy
}

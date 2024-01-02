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

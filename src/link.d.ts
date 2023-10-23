/// <reference types="gecko-types" />

declare module 'resource://app/modules/FaviconLoader.sys.mjs' {
  export const FaviconLoader: typeof import('./modules/FaviconLoader').FaviconLoader
}

declare module 'resource://app/modules/TypedImportUtils.sys.mjs' {
  export const lazyESModuleGetters: typeof import('./modules/TypedImportUtils').lazyESModuleGetters
}

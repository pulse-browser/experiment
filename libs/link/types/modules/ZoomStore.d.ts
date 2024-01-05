declare module 'resource://app/modules/ZoomStore.sys.mjs' {
  import { Emitter } from 'mitt'

  export type ZoomStoreEvents = {
    setZoom: { host: string; zoom: number }
  }

  export const ZoomStore: {
    events: Emitter<ZoomStoreEvents>

    getZoomForUri(uri: nsIURIType): number
    setZoomForUri(uri: nsIURIType, zoom: number): void
  }

  export type ZoomStoreInterface = typeof ZoomStore
}

declare interface MozESMExportFile {
  ZoomStore: 'resource://app/modules/ZoomStore.sys.mjs'
}

declare interface MozESMExportType {
  ZoomStore: typeof import('resource://app/modules/ZoomStore.sys.mjs').ZoomStore
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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

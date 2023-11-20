/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/// <reference types="gecko-types" />

declare module 'resource://app/modules/FaviconLoader.sys.mjs' {
  export const FaviconLoader: typeof import('./modules/FaviconLoader').FaviconLoader
}

declare module 'resource://app/modules/TypedImportUtils.sys.mjs' {
  export const lazyESModuleGetters: typeof import('./modules/TypedImportUtils').lazyESModuleGetters
}

declare interface MozESMExportFile {
  TypedImportUtils: 'resource://app/modules/TypedImportUtils.sys.mjs'
}

declare interface MozESMExportType {
  TypedImportUtils: typeof import('./modules/TypedImportUtils')
}

declare let Cr: Record<string, nsresult>

declare interface Document {
  documentURIObject: nsIURIType
}

declare interface Node {
  nodePrincipal: nsIPrincipalType
  ownerGlobal: Window
  documentLoadGroup: nsIRequestType
}

declare interface LoadURIOptions {
  triggeringPrincipal?: Principal
  csp?: ContentSecurityPolicy
  loadFlags?: number
  referrerInfo?: ReferrerInfo
  postData?: nsIInputStreamType
  headers?: nsIInputStreamType
  baseURI?: nsIURIType
  hasValidUserGestureActivation?: boolean
  triggeringSandboxFlags?: number
  triggeringWindowId?: number
  triggeringStorageAccess?: boolean
  triggeringRemoteType?: string
  cancelContentJSEpoch?: number
  remoteTypeOverride?: string
  wasSchemelessInput?: string
}

declare interface XULBrowserElement extends HTMLElement {
  contentTitle: string
  source: string
  canGoBack: boolean
  goBack()
  canGoForward: boolean
  goForward()
  reload()
  loadURI(uri: nsIURIType, params?: LoadURIOptions)
  browserId: number
  mInitialized: boolean
  webProgress: nsIWebProgressType
}

declare interface XULFindBarElement extends HTMLElement {
  browser: XULBrowserElement
  open()
  close()
}

declare interface XULPanel extends HTMLElement {
  openPopup(target: HTMLElement, anchor: string)
}

declare interface XULMenuPopup extends HTMLElement {
  openPopupAtScreen(
    x?: number,
    y?: number,
    isContextMenu?: boolean,
    trigger?: Event,
  )
}

declare interface PlacesBookmarkTreeNode {
  guid: string
  /** @deprecated */
  id: number
  type?: number
  typeCode?: number
  title: string
  dateAdded: number
  lastModified: number
  index: number

  parentGuid?: string
  itemsCount?: number

  uri?: string
  url?: URL
  tags?: string
  charset?: string
  keyword?: string
  postData?: string
  iconUri?: string

  children?: BookmarkTreeNode[]
}

/**
 * The definition of Deferred object which is returned by PromiseUtils.defer(),
 * It contains a Promise and methods to resolve/reject it.
 */
declare interface GenericDeferred<T, E = unknown> {
  /* A method to resolve the associated Promise with the value passed.
   * If the promise is already settled it does nothing.
   *
   * @param value  This value is used to resolve the promise
   * If the value is a Promise then the associated promise assumes the state
   * of Promise passed as value.
   */
  resolve: (val: T) => void

  /* A method to reject the assocaited Promise with the value passed.
   * If the promise is already settled it does nothing.
   *
   * @param reason The reason for the rejection of the Promise.
   * Generally its an Error object. If however a Promise is passed, then the Promise
   * itself will be the reason for rejection no matter the state of the Promise.
   */
  reject: (err: E) => void

  /* A newly created Pomise object.
   * Initially in pending state.
   */
  promise: Promise<T>
}

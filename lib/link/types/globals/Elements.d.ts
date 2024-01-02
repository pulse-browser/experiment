/// <reference types="gecko-types" />

declare interface Document {
  documentURIObject: nsIURIType
}

declare interface Node {
  nodePrincipal: nsIPrincipalType
  ownerGlobal: Window
  documentLoadGroup: nsIRequestType
}

declare type DOMLinkAddedEvent = Event & {
  target: HTMLLinkElement
  type: 'DOMLinkAdded'
}
declare type DOMHeadParsedEvent = Event & {
  target: HTMLHeadElement
  type: 'DOMHeadElementParsed'
}
declare type PageShowEvent = PageTransitionEvent & { type: 'pageshow' }
declare type PageHideEvent = PageTransitionEvent & { type: 'pagehide' }

declare interface LoadURIOptions {
  triggeringPrincipal?: Principal
  csp?: nsIContentSecurityPolicyType
  loadFlags?: number
  referrerInfo?: nsIReferrerInfoType
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

  docShell: unknown
  swapDocShells(aOtherBrowser: XULBrowserElement)

  messageManager: ChromeMessageSender
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

declare type WebsiteViewEvents = {
  loadingChange: boolean
  progressPercent: number
  locationChange: {
    aWebProgress: nsIWebProgressType
    aRequest: nsIRequestType
    aLocation: nsIURIType
    aFlags: number
    id: number
  }
}

declare type WebsiteView = {
  windowBrowserId: number

  browser: XULBrowserElement
  browserId?: number

  events: import('mitt').Emitter<WebsiteViewEvents>

  tabProgressListener: null | TabProgressListenerCleanup
}

declare interface TabProgressListenerCleanup {
  remove(browser: XULBrowserElement): void
}

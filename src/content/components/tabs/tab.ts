import { writable, type Writable } from 'svelte/store'
import {
  createBrowser,
  getBrowserRemoteType,
  setURI,
} from '../../lib/xul/browser'
import { domContentLoaded } from '../../lib/xul/domevents'
import mitt from 'mitt'
import { spinLock } from '../../lib/spinlock'

export let lastTabAction = { id: -1, before: false }

let localTabId = 0

/**
 * This provides a consistent internal representation of a tab, including the browser elements
 * it contains & information derived from listeners about its current state
 */
export class Tab {
  private _id: number = ++localTabId
  private tabId: number | undefined

  private browserElement: HTMLElement & any
  private progressListener = new TabProgressListener()

  // Publicly available data. Even though these are writable, updating them will not change
  // the state of the browser element
  public title = writable('')
  public icon: Writable<string | null> = writable(null)
  public uri: Writable<nsIURIType>

  public canGoBack = writable(false)
  public canGoForward = writable(false)

  constructor(uri: nsIURIType) {
    this.uri = writable(uri)
    this.goToUri(uri)
    this.browserElement = createBrowser({
      remoteType: getBrowserRemoteType(uri),
    })
    this.title.set(uri.asciiHost)

    this.browserElement.addEventListener('pagetitlechanged', () => {
      this.title.set((this.browserElement as any).contentTitle)
    })

    this.browserElement.addEventListener(
      'DidChangeBrowserRemoteness',
      (e: any) => {
        const browser = e.target
        console.log('chanedRemoteness', e)
        // TODO: Does this leak memory?
        this.progressListener.filter = undefined
        this.progressListener = new TabProgressListener()
        this.progressListener.setup(browser)
        this.useProgressListener()
      },
    )
  }

  public getId(): number {
    return this._id
  }

  /**
   * Gecko's internal tab/browser id. Note that this is not always ready on first render, so
   * you should use {@link this.getId()} for keys etc
   */
  public getTabId(): number {
    return this.tabId || 0
  }

  protected useProgressListener() {
    this.progressListener.events.on('*', console.debug)
    this.progressListener.events.on('locationChange', (event) => {
      if (!event.aWebProgress.isTopLevel) return

      this.uri.set(event.aLocation)
      this.canGoBack.set(this.browserElement.canGoBack)
      this.canGoForward.set(this.browserElement.canGoForward)
    })
  }

  public async setContainer(container: HTMLElement) {
    container.appendChild(this.browserElement)
    this.tabId = (this.browserElement as any).browserId as number

    // Set up progress notifications. These are used for listening on location change etc
    this.progressListener.setup(this.browserElement)
    this.useProgressListener()
  }

  public async goToUri(uri: nsIURIType) {
    // Load the URI once we are sure that the dom has fully loaded
    await domContentLoaded.promise
    // Wait for browser to initialize
    await spinLock(() => this.browserElement.mInitialized)
    setURI(this.browserElement, uri)
  }

  public destroy() {
    this.browserElement.remove()
  }

  public goBack() {
    this.browserElement.goBack()
  }

  public goForward() {
    this.browserElement.goForward()
  }

  public reload() {
    this.browserElement.reload()
  }
}

type TabProgressListenerEventDefaults = {
  aWebProgress: nsIWebProgressType
  aRequest: nsIRequestType
  id: number
}

type TabProgressListenerEvent = {
  locationChange: {
    aLocation: nsIURIType
    aFlags: number
  } & TabProgressListenerEventDefaults
}

let progressListenerCounter = 0
class TabProgressListener
  implements nsIWebProgressListenerType, nsIWebProgressListener2Type
{
  id = progressListenerCounter++

  events = mitt<TabProgressListenerEvent>()
  browser: any

  filter: nsIWebProgressType | undefined

  setup(browser: any) {
    this.browser = browser

    this.filter = Cc[
      '@mozilla.org/appshell/component/browser-status-filter;1'
    ].createInstance(Ci.nsIWebProgress) as nsIWebProgressType
    this.filter.addProgressListener(this, Ci.nsIWebProgress.NOTIFY_ALL)
    browser.webProgress.addProgressListener(
      this.filter,
      Ci.nsIWebProgress.NOTIFY_ALL,
    )
  }

  onProgressChange64(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aCurSelfProgress: number,
    aMaxSelfProgress: number,
    aCurTotalProgress: number,
    aMaxTotalProgress: number,
  ): void {
    console.log('onProgressChange64')
  }

  onRefreshAttempted(
    aWebProgress: nsIWebProgressType,
    aRefreshURI: nsIURIType,
    aMillis: number,
    aSameURI: boolean,
  ): boolean {
    // TODO: There is special functionality that should probibly go here
    return true
  }
  onStateChange(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aStateFlags: number,
    aStatus: number,
  ): void {
    console.log('onStateChange')
  }
  onProgressChange(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aCurSelfProgress: number,
    aMaxSelfProgress: number,
    aCurTotalProgress: number,
    aMaxTotalProgress: number,
  ): void {
    console.log('onProgressChange')
  }
  onLocationChange(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aLocation: nsIURIType,
    aFlags: number,
  ): void {
    this.events.emit('locationChange', {
      aWebProgress,
      aRequest,
      aLocation,
      aFlags,
      id: this.id,
    })
  }
  onStatusChange(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aStatus: number,
    aMessage: string,
  ): void {
    console.log('onStatusChange')
  }
  onSecurityChange(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aState: number,
  ): void {
    console.log('onSecurityChange')
  }
  onContentBlockingEvent(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aEvent: number,
  ): void {
    console.log('onContentBlockingEvent')
  }

  QueryInterface = ChromeUtils.generateQI([
    'nsIWebProgressListener',
    'nsIWebProgressListener2',
    'nsISupportsWeakReference',
  ])
}

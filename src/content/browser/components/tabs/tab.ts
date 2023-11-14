/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { writable, type Writable } from 'svelte/store'
import mitt from 'mitt'

import {
  createBrowser,
  getBrowserRemoteType,
  setURI,
} from '../../lib/xul/browser'
import { domContentLoaded } from '../../lib/xul/domevents'
import { spinLock } from '../../lib/spinlock'
import {
  viewableWritable,
  type ViewableWritable,
} from '../../../shared/svelteUtils'
import { search, type BookmarkTreeNode } from '../../../shared/ExtBookmarkAPI'

export const lastTabAction = { id: -1, before: false }

let localTabId = 0

/**
 * This provides a consistent internal representation of a tab, including the browser elements
 * it contains & information derived from listeners about its current state
 */
export class Tab {
  private _id: number = ++localTabId
  private tabId: number | undefined

  private browserElement: XULBrowserElement
  private progressListener = new TabProgressListener()

  // Publicly available data. Even though these are writable, updating them will not change
  // the state of the browser element
  public title = writable('')
  public icon: ViewableWritable<string | null> = viewableWritable(null)
  public uri: ViewableWritable<nsIURIType>
  public bookmarkInfo: Writable<BookmarkTreeNode | null> = writable(null)

  public findbar: ViewableWritable<XULFindBarElement | undefined> =
    viewableWritable(undefined)

  public canGoBack = writable(false)
  public canGoForward = writable(false)

  public loading = writable(false)
  public loadingProgress = writable(0)

  /**
   * This is used by the omnibox to determine if text input should be focused.
   */
  public tabJustOpened = true

  constructor(uri: nsIURIType) {
    this.uri = viewableWritable(uri)
    this.goToUri(uri)
    this.browserElement = createBrowser({
      remoteType: getBrowserRemoteType(uri),
    })
    this.title.set(uri.asciiHost)

    this.browserElement.addEventListener('pagetitlechanged', () => {
      this.title.set(this.browserElement.contentTitle)
    })

    this.uri.subscribe(async (uri) =>
      this.bookmarkInfo.set(
        await search({ url: uri.spec }).then((r) =>
          r.length > 0 ? (r[0] as BookmarkTreeNode) : null,
        ),
      ),
    )

    this.browserElement.addEventListener('DidChangeBrowserRemoteness', (e) => {
      const browser = e.target
      // TODO: Does this leak memory?
      this.progressListener.filter = undefined
      this.progressListener = new TabProgressListener()
      this.progressListener.setup(browser)
      this.useProgressListener()
    })
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
    this.progressListener.events.on('locationChange', (event) => {
      if (!event.aWebProgress.isTopLevel) return

      this.icon.set(null)

      this.uri.set(event.aLocation)
      this.canGoBack.set(this.browserElement.canGoBack)
      this.canGoForward.set(this.browserElement.canGoForward)
    })

    this.progressListener.events.on('progressPercent', this.loadingProgress.set)
    this.progressListener.events.on('loadingChange', this.loading.set)
  }

  public async setContainer(container: HTMLElement) {
    container.appendChild(this.browserElement)
    this.tabId = this.browserElement.browserId

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

  public showFindBar() {
    if (!this.browserElement) {
      throw new Error('Browser not initialized when adding findbar')
    }

    const findbar = this.findbar.readOnce()
    if (findbar) {
      if (findbar.hidden) findbar.open()
      else findbar.close()
      return
    }

    this.findbar.update(() => document.createXULElement('findbar'))
  }

  public async setupFindbar(
    container: HTMLElement,
    findbar: XULFindBarElement,
  ) {
    container.append(findbar)

    await new Promise((r) => requestAnimationFrame(r))
    findbar.browser = this.browserElement
    this.showFindBar()
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
  progressPercent: number
  loadingChange: boolean
}

/* eslint-disable @typescript-eslint/no-unused-vars */

let progressListenerCounter = 0
class TabProgressListener
  implements nsIWebProgressListenerType, nsIWebProgressListener2Type
{
  id = progressListenerCounter++

  events = mitt<TabProgressListenerEvent>()
  browser: XULBrowserElement | undefined

  filter: (nsIWebProgressListenerType & nsIWebProgressType) | undefined

  setup(browser: XULBrowserElement) {
    this.browser = browser

    this.filter = Cc[
      '@mozilla.org/appshell/component/browser-status-filter;1'
    ].createInstance(Ci.nsIWebProgress) as nsIWebProgressListenerType &
      nsIWebProgressType
    this.filter.addProgressListener(this, Ci.nsIWebProgress.NOTIFY_ALL)
    browser.webProgress.addProgressListener(
      this.filter,
      Ci.nsIWebProgress.NOTIFY_ALL,
    )
  }

  /**
   * This request is identical to {@link onProgressChange64}. The only
   * difference is that the c++ impl uses `long long`s instead of `long`s
   */
  onProgressChange64(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aCurSelfProgress: number,
    aMaxSelfProgress: number,
    aCurTotalProgress: number,
    aMaxTotalProgress: number,
  ): void {
    return this.onProgressChange(
      aWebProgress,
      aRequest,
      aCurSelfProgress,
      aMaxSelfProgress,
      aCurTotalProgress,
      aMaxTotalProgress,
    )
  }

  onRefreshAttempted(
    _aWebProgress: nsIWebProgressType,
    _aRefreshURI: nsIURIType,
    _aMillis: number,
    _aSameURI: boolean,
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
    if (!aWebProgress.isTopLevel) return
    if (
      aStateFlags & Ci.nsIWebProgressListener.STATE_START &&
      aStateFlags & Ci.nsIWebProgressListener.STATE_IS_NETWORK
    ) {
      this.events.emit('loadingChange', true)
    }

    if (
      aStateFlags & Ci.nsIWebProgressListener.STATE_STOP &&
      aStateFlags & Ci.nsIWebProgressListener.STATE_IS_NETWORK
    ) {
      this.events.emit('loadingChange', false)
    }
  }

  onProgressChange(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aCurSelfProgress: number,
    aMaxSelfProgress: number,
    aCurTotalProgress: number,
    aMaxTotalProgress: number,
  ): void {
    if (!aWebProgress || !aWebProgress.isTopLevel) return
    this.events.emit(
      'progressPercent',
      aMaxTotalProgress !== 0 ? aCurTotalProgress / aMaxTotalProgress : 0,
    )
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

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import mitt from 'mitt'
import { type Writable, get, writable } from 'svelte/store'

import { type BookmarkTreeNode, search } from '@shared/ExtBookmarkAPI'
import { type ViewableWritable, viewableWritable } from '@shared/svelteUtils'

import { resource } from '../resources'
import { spinLock } from '../spinlock'
import { createBrowser, getBrowserRemoteType, setURI } from '../xul/browser'
import { domContentLoaded } from '../xul/domevents'

export const lastTabAction = { id: -1, before: false }

let localTabId = 0

/**
 * This provides a consistent internal representation of a tab, including the
 * browser elements it contains & information derived from listeners about its current state
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

  public hidden = writable(false)

  constructor(uri: nsIURIType) {
    this.uri = viewableWritable(uri)
    this.goToUri(uri)
    this.browserElement = createBrowser({
      remoteType: getBrowserRemoteType(uri),
    })
    this.title.set(uri.asciiHost)

    this.uri.subscribe(async (uri) =>
      this.bookmarkInfo.set(
        await search({ url: uri.spec }).then((r) =>
          r.length > 0 ? (r[0] as BookmarkTreeNode) : null,
        ),
      ),
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

  public getDragRepresentation() {
    return {
      windowId: window.windowApi.id,
      tabId: this.getId(),
    }
  }

  _initialized: Promise<void> | undefined
  public get initialized() {
    if (this._initialized) return this._initialized
    // Force fetching the docshell
    this.browserElement.docShell
    return (this._initialized = spinLock(
      () => this.browserElement.mInitialized,
    ))
  }

  // ===========================================================================
  // Event listeners

  protected useEventListeners() {
    this.browserElement.addEventListener(
      'pagetitlechanged',
      this.onPageTitleChanged.bind(this),
    )

    this.browserElement.addEventListener(
      'DidChangeBrowserRemoteness',
      this.onDidChangeBrowserRemoteness.bind(this),
    )

    // Set up progress notifications. These are used for listening on location change etc
    this.progressListener.setup(this.browserElement)
    this.useProgressListener()
  }

  protected removeEventListeners() {
    this.browserElement.removeEventListener(
      'pagetitlechanged',
      this.onPageTitleChanged.bind(this),
    )

    this.browserElement.removeEventListener(
      'DidChangeBrowserRemoteness',
      this.onDidChangeBrowserRemoteness.bind(this),
    )

    this.progressListener.remove(this.browserElement)
  }

  protected onPageTitleChanged() {
    this.title.set(this.browserElement.contentTitle)
  }

  protected onDidChangeBrowserRemoteness(e: Event) {
    const browser = e.target as XULBrowserElement
    // TODO: Does this leak memory?
    this.progressListener.remove(browser)
    this.progressListener = new TabProgressListener()
    this.progressListener.setup(browser)
    this.useProgressListener()
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

    this.useEventListeners()
  }

  public async goToUri(uri: nsIURIType) {
    // Load the URI once we are sure that the dom has fully loaded
    await domContentLoaded.promise
    // Wait for browser to initialize
    await this.initialized
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

  public swapWithTab(tab: Tab) {
    this.removeEventListeners()
    tab.removeEventListeners()

    this.browserElement.swapDocShells(tab.browserElement)

    this.useEventListeners()
    tab.useEventListeners()

    if (this.browserElement.id) this.tabId = this.browserElement.browserId
    if (tab.browserElement.id) tab.tabId = tab.browserElement.browserId

    const otherTitle = get(tab.title)
    const otherIcon = get(tab.icon)
    const otherUri = get(tab.uri)
    const otherBookmarkInfo = get(tab.bookmarkInfo)

    tab.title.set(get(this.title))
    tab.icon.set(get(this.icon))
    tab.uri.set(get(this.uri))
    tab.bookmarkInfo.set(get(this.bookmarkInfo))

    this.title.set(otherTitle)
    this.icon.set(otherIcon)
    this.uri.set(otherUri)
    this.bookmarkInfo.set(otherBookmarkInfo)

    const thisFindbar = get(this.findbar)
    thisFindbar?.remove()
    this.findbar.set(undefined)

    const otherFindbar = get(tab.findbar)
    otherFindbar?.remove()
    tab.findbar.set(undefined)
  }

  public async captureTabToCanvas(
    canvas: HTMLCanvasElement | null = resource.PageThumbs.createCanvas(window),
  ) {
    try {
      await resource.PageThumbs.captureToCanvas(
        this.browserElement,
        canvas,
        undefined,
      )
    } catch (e) {
      console.error(e)
      canvas = null
    }

    return canvas
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
  implements
    Partial<nsIWebProgressListenerType>,
    Partial<nsIWebProgressListener2Type>
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
    this.filter.addProgressListener(
      this as unknown as nsIWebProgressListenerType,
      Ci.nsIWebProgress.NOTIFY_ALL,
    )
    browser.webProgress.addProgressListener(
      this.filter,
      Ci.nsIWebProgress.NOTIFY_ALL,
    )
  }

  remove(browser: XULBrowserElement) {
    browser.webProgress.removeProgressListener(
      this.filter as nsIWebProgressListenerType,
    )
    // @ts-expect-error Incorrect type generation
    this.filter?.removeProgressListener(this)

    this.filter = undefined
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
    // console.log('onStatusChange')
  }
  onSecurityChange(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aState: number,
  ): void {
    // console.log('onSecurityChange')
  }
  onContentBlockingEvent(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aEvent: number,
  ): void {
    // console.log('onContentBlockingEvent')
  }

  QueryInterface = ChromeUtils.generateQI([
    'nsIWebProgressListener',
    'nsIWebProgressListener2',
    'nsISupportsWeakReference',
  ])
}

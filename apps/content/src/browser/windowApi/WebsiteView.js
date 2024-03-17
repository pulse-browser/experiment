// @ts-check
/// <reference types="@browser/link" />
/// <reference types="gecko-types" />
import mitt from 'mitt'
import { readable } from 'svelte/store'

import { browserImports } from '../browserImports.js'

const DEFAULT_BROWSER_ATTRIBUTES = {
  message: 'true',
  messagemanagergroup: 'browsers',
  type: 'content',
  contextmenu: 'browser_context_menu',
}

const { useRemoteTabs, useRemoteSubframe } = window.docShell.QueryInterface(
  Ci.nsILoadContext,
)

let nextWindowBrowserId = 0

/**
 * @param {() => boolean} predicate
 * @param {number} [timing=10]
 */
async function spinlock(predicate, timing = 10) {
  while (!predicate()) {
    await new Promise((res) => setTimeout(res, timing))
  }
}

/**
 * @param {nsIURIType} uri
 * @returns {WebsiteView}
 */
export function create(uri) {
  let originAttributes = browserImports.E10SUtils.predictOriginAttributes({
    window,
  })
  const remoteType = browserImports.E10SUtils.getRemoteTypeForURI(
    uri.spec,
    useRemoteTabs,
    useRemoteSubframe,
    browserImports.E10SUtils.DEFAULT_REMOTE_TYPE,
    uri,
    originAttributes,
  )

  const browser = document.createXULElement('browser')
  if (remoteType) {
    browser.setAttribute('remoteType', remoteType)
    browser.setAttribute('remote', true)
  }

  for (const attribute in DEFAULT_BROWSER_ATTRIBUTES) {
    browser.setAttribute(attribute, DEFAULT_BROWSER_ATTRIBUTES[attribute])
  }

  if (useRemoteTabs) {
    browser.setAttribute('maychangeremoteness', 'true')
  }

  const view = {
    windowBrowserId: nextWindowBrowserId++,
    browser,

    /** @type {import('mitt').Emitter<WebsiteViewEvents>} */
    events: mitt(),
    tabProgressListener: null,
  }

  goTo(view, uri)
  queueMicrotask(async () => {
    await initialized(view)
    registerListeners(view)
  })

  return view
}

/**
 * @param {WebsiteView} view
 */
function initialized(view) {
  view.browser.docShell
  return spinlock(() => view.browser.mInitialized)
}

/**
 * @param {WebsiteView} view
 * @param {nsIURIType} uri
 */
export async function goTo(view, uri) {
  await initialized(view)

  console.debug('Going to', uri)
  view.browser.source = uri.spec
  try {
    view.browser.loadURI(uri, {
      triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
    })
  } catch (e) {
    console.debug('Debug info for changing url')
    console.debug(view, uri)
    console.error(e)
  }
}

/**
 * @param {WebsiteView} view
 */
export function urlState(view) {
  return readable(view.browser.source, (set) => {
    const updateUri = (
      /** @type {{ aWebProgress: nsIWebProgressType; aLocation: nsIURIType; }} */ location,
    ) => location.aWebProgress.isTopLevel && set(location.aLocation.spec)

    view.events.on('locationChange', updateUri)
    return () => view.events.off('locationChange', updateUri)
  })
}

// ==========================================================================
// Handle wacky event registration

/**
 * @param {WebsiteView} view
 */
function registerListeners(view) {
  view.browser.addEventListener(
    'DidChangeBrowserRemoteness',
    didChangeBrowserRemoteness.bind(view),
  )

  registerTabProgressListener(view)
}

/**
 * @param {WebsiteView} view
 */
function registerTabProgressListener(view) {
  if (view.tabProgressListener) {
    view.tabProgressListener.remove(view.browser)
    view.tabProgressListener = null
  }

  view.tabProgressListener = new TabProgressListener(view)
}

/**
 * @this {WebsiteView}
 */
function didChangeBrowserRemoteness() {
  registerTabProgressListener(this)
}

// =======================================================================
// Horrible class incoming!

let progressListenerCounter = 0
class TabProgressListener {
  id = progressListenerCounter++

  /** @type {WebsiteView} */
  view

  /**
   * @type {nsIWebProgressListenerType & nsIWebProgressType} filter
   */
  filter

  /**
   * @param {WebsiteView} view
   */
  constructor(view) {
    this.view = view

    this.filter = Cc[
      '@mozilla.org/appshell/component/browser-status-filter;1'
    ].createInstance(Ci.nsIWebProgress)
    this.filter.addProgressListener(this, Ci.nsIWebProgress.NOTIFY_ALL)
    view.browser.webProgress.addProgressListener(
      this.filter,
      Ci.nsIWebProgress.NOTIFY_ALL,
    )
  }

  /**
   * @param {XULBrowserElement} browser
   */
  remove(browser) {
    browser.webProgress.removeProgressListener(this.filter)
    // @ts-expect-error Incorrect type generation
    this.filter?.removeProgressListener(this)

    this.filter = undefined
  }

  /**
   * This request is identical to {@link onProgressChange64}. The only
   * difference is that the c++ impl uses `long long`s instead of `long`s
   * @param {nsIWebProgressType} aWebProgress - The web progress type
   * @param {nsIRequestType} aRequest - The request type
   * @param {number} aCurSelfProgress - The current self progress
   * @param {number} aMaxSelfProgress - The maximum self progress
   * @param {number} aCurTotalProgress - The current total progress
   * @param {number} aMaxTotalProgress - The maximum total progress
   * @returns {void}
   */
  onProgressChange64(
    aWebProgress,
    aRequest,
    aCurSelfProgress,
    aMaxSelfProgress,
    aCurTotalProgress,
    aMaxTotalProgress,
  ) {
    return this.onProgressChange(
      aWebProgress,
      aRequest,
      aCurSelfProgress,
      aMaxSelfProgress,
      aCurTotalProgress,
      aMaxTotalProgress,
    )
  }

  /**
   * Handles the event when a refresh is attempted.
   * @param {nsIWebProgressType} _aWebProgress - The web progress type
   * @param {nsIURIType} _aRefreshURI - The URI to refresh
   * @param {number} _aMillis - The number of milliseconds to wait before refreshing
   * @param {boolean} _aSameURI - Whether the refresh URI is the same as the current URI
   * @returns {boolean} - Returns true
   */
  onRefreshAttempted(_aWebProgress, _aRefreshURI, _aMillis, _aSameURI) {
    // TODO: There is special functionality that should probably go here
    return true
  }
  /**
   * Handles the state change event.
   * @param {nsIWebProgressType} aWebProgress - The web progress type
   * @param {nsIRequestType} aRequest - The request type
   * @param {number} aStateFlags - The state flags
   * @param {number} aStatus - The status
   * @returns {void}
   */
  onStateChange(aWebProgress, aRequest, aStateFlags, aStatus) {
    if (!aWebProgress.isTopLevel) return
    if (
      aStateFlags & Ci.nsIWebProgressListener.STATE_START &&
      aStateFlags & Ci.nsIWebProgressListener.STATE_IS_NETWORK
    ) {
      this.view.events.emit('loadingChange', true)
    }

    if (
      aStateFlags & Ci.nsIWebProgressListener.STATE_STOP &&
      aStateFlags & Ci.nsIWebProgressListener.STATE_IS_NETWORK
    ) {
      this.view.events.emit('loadingChange', false)
    }
  }

  /**
   * Handles the progress change event.
   * @param {nsIWebProgressType} aWebProgress - The web progress type
   * @param {nsIRequestType} aRequest - The request type
   * @param {number} aCurSelfProgress - The current self progress
   * @param {number} aMaxSelfProgress - The maximum self progress
   * @param {number} aCurTotalProgress - The current total progress
   * @param {number} aMaxTotalProgress - The maximum total progress
   * @returns {void}
   */
  onProgressChange(
    aWebProgress,
    aRequest,
    aCurSelfProgress,
    aMaxSelfProgress,
    aCurTotalProgress,
    aMaxTotalProgress,
  ) {
    if (!aWebProgress || !aWebProgress.isTopLevel) return
    this.view.events.emit(
      'progressPercent',
      aMaxTotalProgress !== 0 ? aCurTotalProgress / aMaxTotalProgress : 0,
    )
  }

  /**
   * Handles the location change event.
   * @param {nsIWebProgressType} aWebProgress - The web progress type
   * @param {nsIRequestType} aRequest - The request type
   * @param {nsIURIType} aLocation - The location URI
   * @param {number} aFlags - The flags
   * @returns {void}
   */
  onLocationChange(aWebProgress, aRequest, aLocation, aFlags) {
    this.view.events.emit('locationChange', {
      aWebProgress,
      aRequest,
      aLocation,
      aFlags,
      id: this.id,
    })
  }

  /**
   * Handles the status change event.
   * @param {nsIWebProgressType} aWebProgress - The web progress type
   * @param {nsIRequestType} aRequest - The request type
   * @param {number} aStatus - The status
   * @param {string} aMessage - The message
   * @returns {void}
   */
  onStatusChange(aWebProgress, aRequest, aStatus, aMessage) {
    // console.log('onStatusChange')
  }

  /**
   * Handles the security change event.
   * @param {nsIWebProgressType} aWebProgress - The web progress type
   * @param {nsIRequestType} aRequest - The request type
   * @param {number} aState - The state
   * @returns {void}
   */
  onSecurityChange(aWebProgress, aRequest, aState) {
    // console.log('onSecurityChange')
  }

  /**
   * Handles the content blocking event.
   * @param {nsIWebProgressType} aWebProgress - The web progress type
   * @param {nsIRequestType} aRequest - The request type
   * @param {number} aEvent - The event
   * @returns {void}
   */
  onContentBlockingEvent(aWebProgress, aRequest, aEvent) {
    // console.log('onContentBlockingEvent')
  }

  QueryInterface = ChromeUtils.generateQI([
    'nsIWebProgressListener',
    'nsIWebProgressListener2',
    'nsISupportsWeakReference',
  ])
}

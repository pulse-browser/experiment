// @ts-check
/* eslint-disable no-undef */
/// <reference path="../types/index.d.ts" />

/** @type {typeof import('resource://app/modules/TypedImportUtils.sys.mjs')} */
const typedImportUtils = ChromeUtils.importESModule(
  'resource://app/modules/TypedImportUtils.sys.mjs',
)
const { lazyESModuleGetters } = typedImportUtils

const lazy = lazyESModuleGetters({
  WindowTracker: 'resource://app/modules/BrowserWindowTracker.sys.mjs',
  EPageActions: 'resource://app/modules/EPageActions.sys.mjs',
  ExtensionParent: 'resource://gre/modules/ExtensionParent.sys.mjs',
})

class TabTracker extends TabTrackerBase {
  get activeTab() {
    /** @type {any | null} */
    const window = lazy.WindowTracker.getActiveWindow()
    return window?.windowApi?.tabs?.getCurrentTab()
  }

  init() {
    if (this.initialized) return
    this.initialized = true
  }

  /**
   * @param {*} nativeTab
   */
  getId(nativeTab) {
    return nativeTab.getTabId()
  }

  getTab(tabId, default_) {
    const { tab } = lazy.WindowTracker.getWindowWithBrowser(tabId) || {
      tab: default_,
    }

    return tab
  }

  getBrowserData(browser) {
    const data = lazy.WindowTracker.getWindowWithBrowser(browser)
    if (!data) return { windowId: -1, tabId: -1 }

    return {
      /** @type {number} */
      // @ts-expect-error bad imported types
      windowId: data.window.windowApi.id,
      /** @type {number} */
      tabId: data.tab.getTabId(),
    }
  }
}

Object.assign(global, { tabTracker: new TabTracker() })

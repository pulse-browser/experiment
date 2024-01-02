type WindowTriggers = {
  bookmarkCurrentPage: undefined
}

declare interface WindowConfiguration {
  /**
   * The initial page to show when the window is opened
   */
  initialUrl: string
}

declare type WindowApi = {
  /**
   * Identify which window this is. This should be used for actions like tab
   * moving that go across windows
   *
   * Note: You need to wait for the window watcher to register this window
   * before you get a valid id
   */
  id: number
  /**
   * Sets the window ID. You should only use this if you are the WindowWatcher
   */
  setId: (id: number) => void

  windowTriggers: import('mitt').Emitter<WindowTriggers>

  window: {
    new: (args?: WindowArguments) => unknown
  }

  tabs: {
    closeTab(tab: Tab): void
    openTab(url?: nsIURIType): Tab
    runOnCurrentTab<R>(callback: (tab: Tab) => R): R | undefined
    setCurrentTab(tab: Tab): void
    getCurrentTab(): Tab | undefined
    getTabById(id: number): Tab | undefined
    tabs: Tab[]
    setIcon(browser: XULBrowserElement, iconURL: string): void
  }

  contextMenu: {
    showContextMenu(menuInfo: ContextMenuInfo, actor: JSWindowActorParent): void
  }
}

declare interface Window {
  windowApi: WindowApi
}

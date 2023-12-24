/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/no-explicit-any */
import mitt from 'resource://app/modules/mitt.sys.mjs'

type Tab = unknown

export type WindowTrackerEvents = {
  windowCreated: Window & typeof globalThis
  windowDestroyed: Window & typeof globalThis

  focus: Window & typeof globalThis
}

export const WindowTracker = {
  /**
   * @private
   */
  nextWindowId: 0,

  events: mitt<WindowTrackerEvents>(),

  activeWindow: null as number | null,
  registeredWindows: new Map<number, typeof window>(),

  /**
   * Registers a new browser window to be tracked
   *
   * @param w The window to register
   */
  registerWindow(w: typeof window) {
    ;(w as any).windowApi.id = this.nextWindowId++
    this.registeredWindows.set((w as any).windowApi.id, w)
    this.events.emit('windowCreated', w)
  },

  removeWindow(w: typeof window) {
    this.registeredWindows.delete((w as any).windowApi.id)
    this.events.emit('windowDestroyed', w)
  },

  getWindowById(wid: number) {
    return this.registeredWindows.get(wid)
  },

  getWindowWithBrowser(
    browser: XULBrowserElement,
  ): { window: Window & typeof globalThis; tab: Tab } | null {
    for (const window of this.registeredWindows.values()) {
      const tab = (window as any).windowApi.tabs.tabs.find(
        (t: Tab) => (t as any).getTabId() === browser.browserId,
      )
      if (tab) return { window, tab }
    }
    return null
  },

  focusWindow(id: number) {
    this.activeWindow = id
    this.events.emit('focus', this.getActiveWindow()!)
  },

  getActiveWindow(): (typeof window & typeof globalThis) | undefined {
    return this.registeredWindows.get(this.activeWindow ?? -1)
  },
}

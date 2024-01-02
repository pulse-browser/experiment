/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

declare module 'resource://app/modules/BrowserWindowTracker.sys.mjs' {
  import type { Emitter } from 'resource://app/modules/mitt.sys.mjs'

  // TODO: Replace this with the correct tab type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Tab = any

  export type WindowTrackerEvents = {
    windowCreated: Window & typeof globalThis
    windowDestroyed: Window & typeof globalThis

    focus: Window & typeof globalThis
  }

  export const WindowTracker: {
    nextWindowId: number

    events: Emitter<WindowTrackerEvents>

    activeWindow: number | null
    registeredWindows: Map<number, typeof window>

    /**
     * Registers a new browser window to be tracked
     *
     * @param w The window to register
     */
    registerWindow(w: typeof window): void

    removeWindow(w: typeof window): void

    getWindowById(wid: number): typeof window | undefined

    getWindowWithBrowser(
      browser: XULBrowserElement,
    ): { window: Window & typeof globalThis; tab: Tab } | null

    focusWindow(id: number): void

    getActiveWindow(): (typeof window & typeof globalThis) | undefined
  }
}

declare interface MozESMExportFile {
  WindowTracker: 'resource://app/modules/BrowserWindowTracker.sys.mjs'
}

declare interface MozESMExportType {
  WindowTracker: typeof import('resource://app/modules/BrowserWindowTracker.sys.mjs').WindowTracker
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import mitt from 'resource://app/modules/mitt.sys.mjs'

export type WindowTrackerEvents = {
  windowCreated: Window & typeof globalThis
  windowDestroyed: Window & typeof globalThis
}

export const WindowTracker = {
  events: mitt<WindowTrackerEvents>(),

  registeredWindows: new Map<string, typeof window>(),

  /**
   * Registers a new browser window to be tracked
   *
   * @param w The window to register
   */
  registerWindow(w: typeof window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.registeredWindows.set((w as any).windowApi.id, w)
    this.events.emit('windowCreated', w)
  },

  removeWindow(w: typeof window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.registeredWindows.delete((w as any).windowApi.id)
    this.events.emit('windowDestroyed', w)
  },

  getWindowById(wid: string) {
    return this.registeredWindows.get(wid)
  },
}

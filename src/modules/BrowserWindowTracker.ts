/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export const WindowTracker = {
  registeredWindows: new Map<string, typeof window>(),

  /**
   * Registers a new browser window to be tracked
   *
   * @param w The window to register
   */
  registerWindow(w: typeof window) {
    this.registeredWindows.set(w.windowApi.id, w)
  },

  removeWindow(w: typeof window) {
    this.registeredWindows.delete(w.windowApi.id)
  },

  getWindowById(wid: string) {
    return this.registeredWindows.get(wid)
  },
}

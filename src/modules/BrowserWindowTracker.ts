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

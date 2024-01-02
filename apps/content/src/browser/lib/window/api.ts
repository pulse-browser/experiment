/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import mitt from 'mitt'

import type { WindowArguments } from '.'
import {
  browserContextMenuInfo,
  setContextMenuParentActor,
} from './contextMenu'
import {
  closeTab,
  getCurrentTab,
  getTabById,
  openTab,
  runOnCurrentTab,
  setCurrentTab,
  tabs,
} from './tabs'
import { id, setId } from './window'

export type WindowTriggers = {
  bookmarkCurrentPage: undefined
}

export const windowApi = {
  /**
   * Identify which window this is. This should be used for actions like tab
   * moving that go across windows
   *
   * Note: You need to wait for the window watcher to register this window
   * before you get a valid id
   */
  id,

  /**
   * Sets the window ID. You should only use this if you are the WindowWatcher
   */
  setId,

  windowTriggers: mitt<WindowTriggers>(),
  window: {
    /**
     * @todo Move this into BrowserWindowTracker
     */
    new: (args?: WindowArguments) =>
      Services.ww.openWindow(
        // @ts-expect-error Incorrect type generation
        null,
        Services.prefs.getStringPref('app.content'),
        '_blank',
        'chrome,dialog=no,all',
        args,
      ),
  },
  tabs: {
    closeTab,
    openTab,
    runOnCurrentTab,
    setCurrentTab,
    getCurrentTab,
    getTabById,
    get tabs() {
      return tabs.readOnce()
    },
    setIcon: (browser: XULBrowserElement, iconURL: string) =>
      tabs
        .readOnce()
        .find((tab) => tab.getTabId() == browser.browserId)
        ?.icon.set(iconURL),
  },
  contextMenu: {
    showContextMenu: (
      menuInfo: ContextMenuInfo,
      actor: JSWindowActorParent,
    ) => {
      browserContextMenuInfo.set(menuInfo)
      setContextMenuParentActor(actor)

      requestAnimationFrame(() => {
        const contextMenu = document.getElementById(
          'browser_context_menu',
        ) as XULMenuPopup
        contextMenu.openPopupAtScreen(
          menuInfo.position.screenX,
          menuInfo.position.screenY,
          true,
        )
      })
    },
  },
}

window.windowApi = windowApi

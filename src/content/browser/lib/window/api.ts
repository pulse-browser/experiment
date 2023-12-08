/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import mitt from 'mitt'

import type { ContextMenuInfo } from '../../../../actors/ContextMenu.types'
import {
  browserContextMenuInfo,
  setContextMenuParentActor,
} from './contextMenu'
import { closeTab, openTab, tabs } from './tabs'

export type WindowTriggers = {
  bookmarkCurrentPage: undefined
}

export const windowApi = {
  windowTriggers: mitt<WindowTriggers>(),
  closeTab,
  openTab,
  get tabs() {
    return tabs.readOnce()
  },
  setIcon: (browser: XULBrowserElement, iconURL: string) =>
    tabs
      .readOnce()
      .find((tab) => tab.getTabId() == browser.browserId)
      ?.icon.set(iconURL),
  showContextMenu: (menuInfo: ContextMenuInfo, actor: JSWindowActorParent) => {
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
}

window.windowApi = windowApi

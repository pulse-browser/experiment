/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import mitt from 'mitt'
import { writable } from 'svelte/store'

import type { ContextMenuInfo } from '../../../actors/ContextMenu.types'
import { viewableWritable } from '../../shared/svelteUtils'
import { Tab } from '../components/tabs/tab'
import { resource } from './resources'

export let contextMenuParentActor: JSWindowActorParent
export const browserContextMenuInfo = writable<ContextMenuInfo>({
  position: { screenX: 0, screenY: 0, inputSource: 0 },
  context: {},
})

let internalSelectedTab = -1
export const selectedTab = writable(-1)
selectedTab.subscribe((v) => (internalSelectedTab = v))

const uriPref = (pref: string) => (): nsIURIType =>
  resource.NetUtil.newURI(Services.prefs.getStringPref(pref, 'about:blank'))
const newTabUri = uriPref('browser.newtab.default')
const newWindowUri = uriPref('browser.newwindow.default')

export const tabs = viewableWritable<Tab[]>([])
openTab(newWindowUri())

export function openTab(uri: nsIURIType = newTabUri()) {
  const newTab = new Tab(uri)
  tabs.update((tabs) => {
    selectedTab.set(newTab.getId())
    return [...tabs, newTab]
  })
  return newTab
}

export function closeTab(tab: Tab) {
  tabs.update((tabs) => {
    const tabIndex = tabs.findIndex((t) => t.getId() == tab.getId())
    const filtered = tabs.filter((t) => t.getId() != tab.getId())

    if (filtered.length == 0) {
      window.close()
      return []
    }

    if (filtered[tabIndex]) {
      selectedTab.set(filtered[tabIndex].getId())
    } else {
      selectedTab.set(filtered[tabIndex - 1].getId())
    }

    tab.destroy()
    return filtered
  })
}

function getCurrent(): Tab | undefined {
  return tabs.readOnce().find((t) => t.getId() == internalSelectedTab)
}

export function setCurrentTab(tab: Tab) {
  const index = tabs.readOnce().findIndex((t) => t.getId() == tab.getId())
  setCurrentTabIndex(index)
}

export function runOnCurrentTab<R>(method: (tab: Tab) => R): R | void {
  const currentTab = getCurrent()
  if (currentTab) return method(currentTab)
}

export function getCurrentTabIndex(): number {
  return tabs.readOnce().findIndex((tab) => tab.getId() == internalSelectedTab)
}

export function setCurrentTabIndex(index: number) {
  const allTabs = tabs.readOnce()

  // Wrap the index
  if (index < 0) index = allTabs.length - 1
  if (index >= allTabs.length) index = 0

  selectedTab.set(allTabs[index].getId())
}

export function moveTabBefore(toMoveId: number, targetId: number) {
  tabs.update((tabs) => {
    const toMoveIndex = tabs.findIndex((tab) => tab.getId() == toMoveId)
    const targetIndex = Math.max(
      tabs.findIndex((tab) => tab.getId() == targetId) - 1,
      0,
    )

    // If we do in-place modifications with tabs, svelte won't notice the
    // change
    const newTabs = [...tabs]
    insertAndShift(newTabs, toMoveIndex, targetIndex)
    return newTabs
  })
}

export function moveTabAfter(toMoveId: number, targetId: number) {
  tabs.update((tabs) => {
    const toMoveIndex = tabs.findIndex((tab) => tab.getId() == toMoveId)
    const targetIndex = tabs.findIndex((tab) => tab.getId() == targetId)

    // If we do in-place modifications with tabs, svelte won't notice the
    // change
    const newTabs = [...tabs]
    insertAndShift(newTabs, toMoveIndex, targetIndex)
    return newTabs
  })
}

function insertAndShift<T>(arr: T[], from: number, to: number) {
  const cutOut = arr.splice(from, 1)[0]
  arr.splice(to, 0, cutOut)
}

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
    contextMenuParentActor = actor

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

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { viewableWritable } from '@experiment/shared'
import { writable } from 'svelte/store'

import { resource } from '../resources'
import { Tab } from './tab'

let internalSelectedTab = -1
export const selectedTabId = writable(-1)
selectedTabId.subscribe((v) => (internalSelectedTab = v))

const uriPref = (pref: string) => (): nsIURIType =>
  resource.NetUtil.newURI(Services.prefs.getStringPref(pref, 'about:blank'))
const newTabUri = uriPref('browser.newtab.default')
export const ABOUT_BLANK = resource.NetUtil.newURI('about:blank')

export const tabs = viewableWritable<Tab[]>([])

export function openTab(uri: nsIURIType = newTabUri()) {
  const newTab = new Tab(uri)
  tabs.update((tabs) => {
    selectedTabId.set(newTab.getId())
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
      selectedTabId.set(filtered[tabIndex].getId())
    } else {
      selectedTabId.set(filtered[tabIndex - 1].getId())
    }

    tab.destroy()
    return filtered
  })
}

export function getTabById(id: number): Tab | undefined {
  return tabs.readOnce().find((tab) => tab.getId() == id)
}

export function getCurrentTab(): Tab | undefined {
  return getTabById(internalSelectedTab)
}

export function setCurrentTab(tab: Tab) {
  const index = tabs.readOnce().findIndex((t) => t.getId() == tab.getId())
  setCurrentTabIndex(index)
}

export function runOnCurrentTab<R>(method: (tab: Tab) => R): R | void {
  const currentTab = getCurrentTab()
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

  selectedTabId.set(allTabs[index].getId())
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

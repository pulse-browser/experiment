/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { Ring, not, viewableWritable } from '@experiment/shared'

import { resource } from '../resources'
import { Tab } from './tab'

const tabHistory = new Ring<number>(10)
export const selectedTabId = viewableWritable(-1)
selectedTabId.subscribe((id) => tabHistory.next(id))

const uriPref = (pref: string) => (): nsIURIType =>
  resource.NetUtil.newURI(Services.prefs.getStringPref(pref, 'about:blank'))
const newTabUri = uriPref('browser.newtab.default')
export const ABOUT_BLANK = resource.NetUtil.newURI('about:blank')

export const tabs = viewableWritable<Tab[]>([])

const matchTab = (id: number) => (tab: Tab) => tab.getId() === id

export function openTab(uri: nsIURIType = newTabUri()) {
  const newTab = new Tab(uri)

  // We only want to focus the omnibox on new tab pages
  if (uri.asciiSpec != newTabUri().asciiSpec) {
    newTab.focusedOmnibox.set(false)
  }

  tabs.update((tabs) => {
    selectedTabId.set(newTab.getId())
    return [...tabs, newTab]
  })
  return newTab
}

export function closeTab(tab: Tab) {
  tabs.update((tabs) => {
    const tabIndex = tabs.findIndex(matchTab(tab.getId()))
    const filtered = tabs.filter(not(matchTab(tab.getId())))

    if (filtered.length == 0) {
      window.close()
      return []
    }

    const lastTabId = tabHistory.prev()
    const hasLastTab = filtered.some(matchTab(lastTabId))
    if (hasLastTab) {
      selectedTabId.set(lastTabId)
    } else {
      if (filtered[tabIndex]) {
        selectedTabId.set(filtered[tabIndex].getId())
      } else {
        selectedTabId.set(filtered[tabIndex - 1].getId())
      }
    }

    tab.destroy()
    return filtered
  })
}

export function getTabById(id: number): Tab | undefined {
  return tabs.readOnce().find(matchTab(id))
}

export function getCurrentTab(): Tab | undefined {
  return getTabById(selectedTabId.readOnce())
}

export function setCurrentTab(tab: Tab) {
  const index = tabs.readOnce().findIndex(matchTab(tab.getId()))
  setCurrentTabIndex(index)
}

export function runOnCurrentTab<R>(method: (tab: Tab) => R): R | undefined {
  const currentTab = getCurrentTab()
  if (currentTab) return method(currentTab)
}

export function getCurrentTabIndex(): number {
  return tabs.readOnce().findIndex(matchTab(selectedTabId.readOnce()))
}

export function setCurrentTabIndex(index: number) {
  const allTabs = tabs.readOnce()

  // Wrap the index
  if (index < 0) index = allTabs.length - 1
  if (index >= allTabs.length) index = 0

  const tabId = allTabs[index].getId()
  selectedTabId.set(tabId)
}

export function moveTabBefore(toMoveId: number, targetId: number) {
  tabs.update((tabs) => {
    const toMoveIndex = tabs.findIndex(matchTab(toMoveId))
    const targetIndex = Math.max(tabs.findIndex(matchTab(targetId)) - 1, 0)

    // If we do in-place modifications with tabs, svelte won't notice the
    // change
    const newTabs = [...tabs]
    insertAndShift(newTabs, toMoveIndex, targetIndex)
    return newTabs
  })
}

export function moveTabAfter(toMoveId: number, targetId: number) {
  tabs.update((tabs) => {
    const toMoveIndex = tabs.findIndex(matchTab(toMoveId))
    const targetIndex = tabs.findIndex(matchTab(targetId))

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

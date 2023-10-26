import { writable } from 'svelte/store'

import type { ContextMenuInfo } from '../../actors/ContextMenu.types'

import { Tab } from '../components/tabs/tab'
import { resource } from './resources'

export const browserContextMenuInfo = writable<ContextMenuInfo>({
  position: { x: 0, y: 0 },
})

let internalSelectedTab = -1
export const selectedTab = writable(-1)
selectedTab.subscribe((v) => (internalSelectedTab = v))

export const tabs = writable([
  new Tab(resource.NetUtil.newURI('https://google.com')),
  new Tab(resource.NetUtil.newURI('https://google.com')),
])

export function openTab(url = 'https://google.com') {
  tabs.update((tabs) => [...tabs, new Tab(resource.NetUtil.newURI(url))])
}

export function closeTab(tab: Tab) {
  tabs.update((tabs) => {
    console.log(tab, tabs)
    tab.destroy()
    return tabs.filter((t) => t.getId() != tab.getId())
  })
}

export function runOnCurrentTab(method: (tab: Tab) => void) {
  tabs.update((tabs) => {
    const currentTab = tabs.find((t) => t.getTabId() == internalSelectedTab)
    if (currentTab) method(currentTab)
    return tabs
  })
}

export const windowApi = {
  closeTab,
  openTab,
  setIcon: (browser: any, iconURL: string) =>
    tabs.update((tabs) => {
      tabs.find((tab) => tab.getTabId() == browser.browserId)?.icon.set(iconURL)
      return tabs
    }),
  showContextMenu: (menuInfo: ContextMenuInfo) => {
    browserContextMenuInfo.set(menuInfo)

    const event = document.createEvent('MouseEvent')
    event.initNSMouseEvent(
      'contextmenu',
      true,
      true,
      null,
      0,
      menuInfo.position.screenX,
      menuInfo.position.screenY,
      0,
      0,
      false,
      false,
      false,
      false,
      2,
      null,
      0,
      menuInfo.position.inputSource,
    )

    const contextMenu = document.getElementById('browser_context_menu')
    contextMenu.openPopupAtScreen(
      menuInfo.position.screenX,
      menuInfo.position.screenY,
      true,
      event,
    )
  },
}

window.windowApi = windowApi

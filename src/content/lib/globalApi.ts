import { writable } from 'svelte/store'
import { Tab } from '../components/tabs/tab'
import { resource } from './resources'

export const tabs = writable([
  new Tab(resource.NetUtil.newURI('https://google.com')),
  new Tab(resource.NetUtil.newURI('https://google.com')),
])

export const windowApi = {
  setIcon: (browser: any, iconURL: string) =>
    tabs.update((tabs) => {
      tabs.find((tab) => tab.getId() == browser.browserId)?.icon.set(iconURL)
      return tabs
    }),
}

window.windowApi = windowApi

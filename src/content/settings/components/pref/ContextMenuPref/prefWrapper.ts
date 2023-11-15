import { writable } from 'svelte/store'

import { type MenuItem, fromIdString, toIdString } from '@shared/contextMenus'

export function contextMenuPrefWrapper(pref: string) {
  const store = writable<MenuItem[]>([])

  {
    const prefValue = Services.prefs.getStringPref(pref, '')
    store.set(fromIdString(prefValue))
  }

  store.subscribe((value) => {
    Services.prefs.setStringPref(pref, toIdString(value))
  })

  return store
}

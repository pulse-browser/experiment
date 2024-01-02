/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

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

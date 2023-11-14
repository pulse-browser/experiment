/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { runOnCurrentTab } from './globalApi'

interface AppCommandEvent extends Event {
  command:
    | 'Back'
    | 'Forward'
    | 'Reload'
    | 'Stop'
    | 'Search'
    | 'Bookmarks'
    | 'Home'
    | 'New'
    | 'Close'
    | 'Find'
    | 'Help'
    | 'Open'
    | 'Print'
    | 'Save'
    | 'SendMail'
}

export function initializeShortcuts() {
  document.addEventListener('AppCommand', (untypedEvent) => {
    const event = untypedEvent as AppCommandEvent
    switch (event.command) {
      case 'Back':
        runOnCurrentTab((tab) => tab.goBack())
        break
      case 'Forward':
        runOnCurrentTab((tab) => tab.goForward())
        break
      default:
        console.log(event)
    }
  })
}

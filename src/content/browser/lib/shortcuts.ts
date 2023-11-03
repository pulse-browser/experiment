/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { runOnCurrentTab } from './globalApi'

export function initializeShortcuts() {
  document.addEventListener('AppCommand', (event: any) => {
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

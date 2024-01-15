/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { TestManager } from 'resource://app/modules/TestManager.sys.mjs'

TestManager.browserTest('Has Tabs', (window) => (test) => {
  test.notEq(
    window.document.getElementsByClassName('tabs').length,
    0,
    'There must be at least one element with the class tabs',
  )
})

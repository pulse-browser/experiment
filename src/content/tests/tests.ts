/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { test } from 'zora'
import { manageTests } from './manager'

import shared from './shared'

async function tests() {
  await shared()
}

await manageTests(tests)

if (module.hot) {
  module.hot.dispose(() => window.location.reload())
}

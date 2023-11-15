/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { test } from 'zora'

import {
  MENU_ITEM_ACTIONS,
  fromIdString,
  toIdString,
} from '@shared/contextMenus'

export default async function () {
  await test('toIdString', (t) => {
    t.eq(
      toIdString([...MENU_ITEM_ACTIONS, { type: 'separator' }]),
      'selection__copy,link__copy,link__new-tab,separator',
    )
  })

  await test('fromIdString', (t) => {
    t.eq(fromIdString('link__copy,link__new-tab,separator,selection__copy'), [
      MENU_ITEM_ACTIONS[1],
      MENU_ITEM_ACTIONS[2],
      { type: 'separator' },
      MENU_ITEM_ACTIONS[0],
    ])
  })
}

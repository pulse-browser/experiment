/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { test } from 'zora'

import { search } from '@shared/ExtHistoryAPI'

export default async function () {
  await test('ExtHistoryApi: Search, default options', async (t) => {
    const result = await search({})
    t.ok(Array.isArray(result), 'Search should be an array')
  })
}

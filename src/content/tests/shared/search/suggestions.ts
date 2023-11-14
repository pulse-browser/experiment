/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { test } from 'zora'

import { suggestions } from '@shared/search/suggestions'

export default async function () {
  await test('suggestions: google.com', async (t) => {
    const results = await suggestions('google.com')
    t.ok(results.length > 0, 'should return results')
    t.eq(
      results[0].url,
      'https://google.com',
      'Highest priority result should be url prediction',
    )
  })

  await test('suggestions: tes', async (t) => {
    const results = await suggestions('tes')
    t.ok(results.length > 0, 'should return results')
    t.truthy(results[0].url, 'should have a url')
  })
}

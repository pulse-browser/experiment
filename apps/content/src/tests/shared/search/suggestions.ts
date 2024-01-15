/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { test } from 'zora'

import { suggestions } from '@shared/search/suggestions'

export default async function () {
  await test('suggestions: google.com', async (t) => {
    const { fast: fastP, full: fullP } = suggestions('google.com')
    const fast = await fastP
    const full = await fullP

    t.ok(fast.length > 0, 'fast should return results')
    t.ok(full.length > 0, 'full should return results')
    t.eq(
      fast[0].url,
      'https://google.com',
      'Highest priority fast result should be url prediction',
    )
    t.eq(
      full[0].url,
      'https://google.com',
      'Highest priority full result should be url prediction',
    )
  })

  await test('suggestions: tes', async (t) => {
    const { fast: fastP, full: fullP } = suggestions('tes')
    const fast = await fastP
    const full = await fullP

    t.ok(fast.length > 0, 'should return results')
    t.truthy(fast[0].url, 'should have a url')
    t.truthy(
      fast.length <= full.length,
      'full should have the same or more results than fast',
    )
  })
}

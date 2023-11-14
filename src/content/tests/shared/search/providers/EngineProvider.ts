/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { SEARCH_ENGINE_IDS, SEARCH_ENGINE_PREF } from '@shared/search/constants'
import { searchEngineService } from '@shared/search/engine'
import { EngineProvider } from '@shared/search/providers'
import { test } from 'zora'

export default async function () {
  for (const engine of SEARCH_ENGINE_IDS) {
    await testProvider(engine)
  }
}

async function testProvider(providerExtensionId: string) {
  Services.prefs.setStringPref(SEARCH_ENGINE_PREF, providerExtensionId)
  await searchEngineService.reinit()

  const provider = new EngineProvider()

  await test(`EngineProvider [${providerExtensionId}]: tes`, async (t) => {
    const results = await provider.getResults('tes')
    t.ok(results.length > 0, 'Should return suggestions')
  })

  await test(`EngineProvider [${providerExtensionId}]: empty str`, async (t) => {
    const result = await provider.getResults('')
    t.eq(result, [], "Shouldn't try and find results")
  })
}

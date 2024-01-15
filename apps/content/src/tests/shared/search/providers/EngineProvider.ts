/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { test } from 'zora'

import { SEARCH_ENGINE_IDS, SEARCH_ENGINE_PREF } from '@shared/search/constants'
import { searchEngineService } from '@shared/search/engine'
import { ResultPriority } from '@shared/search/provider'
import { EngineProvider } from '@shared/search/providers'

export default async function () {
  await test('EngineProvider: ignore URL like', async (t) => {
    const provider = new EngineProvider()
    {
      const results = await provider.getResults('http://google.com')
      t.eq(results, [], 'Should ignore full URLs')
    }
    {
      const results = await provider.getResults('google.com')
      t.eq(results, [], 'Should ignore domains')
    }
    {
      const results = await provider.getResults(
        'chrome://browser/content/tests/index.html',
      )
      t.eq(results, [], 'Should ignore chrome URLs')
    }
  })

  await test('EngineProvider: query with no recommendations', async (t) => {
    const provider = new EngineProvider()
    const results = await provider.getResults(
      'cc4ce6fc-c166-4501-b34f-bda93579efc2',
    )
    t.eq(results.length, 1, 'Should have a single result')
    t.eq(results[0].priority, ResultPriority.HIGH, 'Should have high priority')
  })

  await test('EngineProvider: fast recommendations', async (t) => {
    const provider = new EngineProvider()
    const results = await provider.getFastResults('tes')
    t.equals(results.length, 1, 'should have a single result')
    t.equals(
      results[0].priority,
      ResultPriority.HIGH,
      'should have a high priority',
    )
    t.equals(results[0].title, 'tes', 'should have the same title')
  })

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
    t.truthy(results[0].url, 'Should have a url')
  })

  await test(`EngineProvider [${providerExtensionId}]: empty str`, async (t) => {
    const result = await provider.getResults('')
    t.eq(result, [], "Shouldn't try and find results")
  })
}

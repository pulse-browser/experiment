/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { Provider } from './provider'
import { EngineProvider, URLProvider } from './providers'

/**
 * All providers that should be used for suggestions. Already sorted by priority.
 */
const PROVIDERS: Provider[] = [new URLProvider(), new EngineProvider()].sort(
  (a, b) => a.providerPriority - b.providerPriority,
)

export interface Suggestion {
  title: string
  icon?: string
  url: string
}

/**
 * Generates a list of autocomplete suggestions for the user's input
 * @param query The user's input to perform prediction on
 * @returns The suggestions for the user's input
 */
export async function suggestions(query: string): Promise<Suggestion[]> {
  let results = await Promise.all(
    PROVIDERS.map((provider) => provider.getResults(query)),
  )

  return (
    results
      .flat()
      // We want to sort by priority from low to high
      .sort((a, b) => a.priority - b.priority)
      .filter((_, index) => index < 5)
      .map(({ title, icon, url }) => ({ title, icon, url }))
  )
}

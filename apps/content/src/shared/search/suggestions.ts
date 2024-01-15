/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import type { Provider, ProviderResult } from './provider'
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

const take =
  (n: number) =>
  <T>(_: T, i: number) =>
    i < n

function processResults(providerResults: ProviderResult[][]): Suggestion[] {
  return providerResults
    .flat()
    .sort((a, b) => a.priority - b.priority)
    .filter(take(5))
    .map(({ title, icon, url }) => ({ title, icon, url }))
}

/**
 * Generates a list of autocomplete suggestions for the user's input
 * @param query The user's input to perform prediction on
 * @returns The suggestions for the user's input
 */
export function suggestions(query: string): {
  fast: Promise<Suggestion[]>
  full: Promise<Suggestion[]>
} {
  const fastResultsPromise = Promise.all(
    PROVIDERS.map((provider) => provider.getFastResults(query)),
  )
  const fullResultsPromise = Promise.all(
    PROVIDERS.map((provider) => provider.getResults(query)),
  )

  const fastSuggestions = fastResultsPromise.then(processResults)
  const fullSuggestions = fullResultsPromise.then(async (results) =>
    processResults([...(await fastResultsPromise), ...results]),
  )

  return { fast: fastSuggestions, full: fullSuggestions }
}

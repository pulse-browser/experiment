/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { AddonSearchEngine } from 'resource://gre/modules/AddonSearchEngine.sys.mjs'
import { Deferred } from '../Deferred'
import { lazyESModuleGetters } from '../../../shared/TypedImportUtilities'

const lazy = lazyESModuleGetters({
  AddonSearchEngine: 'resource://gre/modules/AddonSearchEngine.sys.mjs',
  SearchUtils: 'resource://gre/modules/SearchUtils.sys.mjs',
})

const SEARCH_ENGINE_IDS = [
  'ddg@search.fushra.com',
  'google@search.fushra.com',
] as const

class SearchService {
  private initPromise: Deferred<void> | undefined
  private searchEngines: Deferred<AddonSearchEngine[]> = new Deferred()

  constructor() {}

  /**
   * Assorted fixups for mozilla APIs that are hard coded to use mozilla.org etc
   */
  private fixup() {
    const generalSearchEngines = lazy.SearchUtils
      .GENERAL_SEARCH_ENGINE_IDS as Set<string>
    const values = [...generalSearchEngines.values()]
    for (const value of values) {
      generalSearchEngines.delete(value)
      generalSearchEngines.add(
        value.replace(/@search\.mozilla\.org$/, '@search.fushra.com'),
      )
    }
  }

  private async init() {
    if (this.initPromise) return await this.initPromise.promise
    this.initPromise = new Deferred()

    this.fixup()

    const locale = lazy.SearchUtils.DEFAULT_TAG
    const engines: AddonSearchEngine[] = []

    for (const extensionID of SEARCH_ENGINE_IDS) {
      const engine = new (lazy.AddonSearchEngine as any)({
        isAppProvided: true,
        details: { extensionID, locale },
      })
      await engine.init({ locale })

      engines.push(engine)
    }

    this.searchEngines.resolve(engines)
    this.initPromise.resolve()
  }

  async getSearchEngines() {
    await this.init()
    return await this.searchEngines.promise
  }
}

export const searchService = new SearchService()

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { Deferred } from '@experiment/shared'

import type { AddonSearchEngine } from 'resource://gre/modules/AddonSearchEngine.sys.mjs'

import {
  DEFAULT_SEARCH_ENGINE,
  SEARCH_ENGINE_IDS,
  SEARCH_ENGINE_PREF,
} from './constants'
import { searchResources } from './resources'

const lazy = searchResources

class SearchEngineService {
  private initPromise: Deferred<void> | undefined

  private searchEngines: Deferred<AddonSearchEngine[]> = new Deferred()
  private defaultEngine: Deferred<AddonSearchEngine> = new Deferred()

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

  public async reinit() {
    this.initPromise = undefined
    this.searchEngines = new Deferred()
    this.defaultEngine = new Deferred()

    await this.init()
  }

  private async init() {
    if (this.initPromise) return await this.initPromise.promise
    this.initPromise = new Deferred()

    this.fixup()

    const locale = lazy.SearchUtils.DEFAULT_TAG
    const engines: AddonSearchEngine[] = []
    for (const extensionID of SEARCH_ENGINE_IDS) {
      const engine = new lazy.AddonSearchEngine({
        isAppProvided: true,
        details: { extensionID, locale },
      })
      // For some reason, mozilla's implementation does not include `engine`
      // when initing. Hence, we don't here even though the types require it
      // https://searchfox.org/mozilla-central/source/toolkit/components/search/SearchService.sys.mjs#3610
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await engine.init({ locale } as any)

      engines.push(engine)
    }
    this.searchEngines.resolve(engines)

    const defaultEngineId = Services.prefs.getStringPref(
      SEARCH_ENGINE_PREF,
      DEFAULT_SEARCH_ENGINE,
    )
    const defaultEngine = engines.find(
      (engine) => engine._extensionID === defaultEngineId,
    )!
    this.defaultEngine.resolve(defaultEngine)

    this.initPromise.resolve()
  }

  async getSearchEngines() {
    await this.init()
    return await this.searchEngines.promise
  }

  async getDefaultEngine() {
    await this.init()
    return await this.defaultEngine.promise
  }
}

export const searchEngineService = new SearchEngineService()

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import type { AddonSearchEngine } from 'resource://gre/modules/AddonSearchEngine.sys.mjs'

import { Deferred } from '@shared/Deferred'

import { isUrlLike } from '.'
import { searchEngineService } from '../engine'
import { Provider, type ProviderResult, ResultPriority } from '../provider'
import { searchResources } from '../resources'

export class EngineProvider extends Provider {
  public providerPriority = 3

  private engine: Deferred<AddonSearchEngine> = new Deferred()

  constructor() {
    super()
    this.init()
  }

  private async init() {
    this.engine.resolve(await searchEngineService.getDefaultEngine())
  }

  private getSearchUri(engine: AddonSearchEngine, query: string): nsIURIType {
    const submission = engine.getSubmission(query)
    return submission.uri
  }

  async getResults(query: string): Promise<ProviderResult[]> {
    if (query == '' || isUrlLike(query)) return []

    const engine = await this.engine.promise
    const submission = engine.getSubmission(
      query,
      searchResources.SearchUtils.URL_TYPE.SUGGEST_JSON,
    )

    const request = fetch(submission.uri.spec, {
      method: submission.postData ? 'POST' : 'GET',
      body: submission.postData,
    })

    const response = await request
    const body = await response.text()

    const defaultSearchResult: ProviderResult = {
      title: query,
      url: this.getSearchUri(engine, query).spec,
      priority: ResultPriority.HIGH,
    }

    if (response.status != 200) {
      console.error(
        `Search engine ${engine.name} returned status ${response.status}`,
      )
      return [defaultSearchResult]
    }

    try {
      const json = JSON.parse(body)
      const results = json[1].map((result: string) => {
        return {
          title: result,
          url: this.getSearchUri(engine, result).spec,
          priority: ResultPriority.LOW,
        }
      })
      return [defaultSearchResult, ...results]
    } catch (e) {
      console.error(
        `Search engine ${engine.name} returned invalid JSON: ${body}`,
      )
      return [defaultSearchResult]
    }
  }
}

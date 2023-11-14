/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { AddonSearchEngine } from 'resource://gre/modules/AddonSearchEngine.sys.mjs'

import { Provider, ResultPriority, type ProviderResult } from '../provider'
import { searchEngineService } from '../engine'
import { searchResources } from '../resources'
import { Deferred } from '@shared/Deferred'
import { isUrlLike } from '.'

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

    if (response.status != 200) {
      console.error(
        `Search engine ${engine.name} returned status ${response.status}`,
      )
      return []
    }

    try {
      const json = JSON.parse(body)
      return json[1].map((result: string) => {
        const searchSubmission = engine.getSubmission(result)

        return {
          title: result,
          url: searchSubmission.uri.spec,
          priority: ResultPriority.LOW,
        }
      })
    } catch (e) {
      console.error(
        `Search engine ${engine.name} returned invalid JSON: ${body}`,
      )
      return []
    }
  }
}

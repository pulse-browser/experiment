/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { AddonSearchEngine } from 'resource://gre/modules/AddonSearchEngine.sys.mjs'

import { Provider, type ProviderResult } from '../provider'
import { Deferred } from '../../Deferred'

export class EngineProvider extends Provider {
  engine: Deferred<AddonSearchEngine> = new Deferred()

  getResults(query: string): Promise<ProviderResult[]> {
    throw new Error('Method not implemented.')
  }
}

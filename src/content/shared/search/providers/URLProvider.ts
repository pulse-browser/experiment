/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Provider, type ProviderResult } from '../provider'
import tld from './data/tld.txt'

const URL_REGEX =
  /^^(?<protocol>https?:\/\/)?(?<domain>(\w+\.)+(?<tld>\w+))(?<path>\/.*)?$$/gm
const tlds = tld
  .split('\n')
  .filter((tld) => tld.length > 0 && !tld.startsWith('#'))

export class URLProvider extends Provider {
  public async getResults(query: string): Promise<ProviderResult[]> {
    const match = URL_REGEX.exec(query)
    if (match === null) return []

    const { protocol, domain, tld, path } = match.groups || {}
    const uri = `${protocol ?? 'https://'}${domain}.${tld}${path ?? ''}`

    // If it is not a valid tld, don't show it
    if (!tlds.includes(tld)) return []

    return [
      {
        title: uri,
        url: Services.io.newURI(uri),
        icon: `chrome://branding/content/icon32.png`,
      },
    ]
  }
}

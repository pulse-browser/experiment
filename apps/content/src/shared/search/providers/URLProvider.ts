/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { Provider, type ProviderResult, ResultPriority } from '../provider'
import tld from './data/tld.txt'

const HTTPS_REGEX =
  /^(?<protocol>https?:\/\/)?(?<domain>(\w+\.)+(?<tld>\w+))(?<path>\/.*)?$/m
const EXTENSION_REGEX = /^moz-extension:\/\/.+$/m
const CHROME_REGEX = /^chrome:\/\/.+$/m
const ABOUT_REGEX = /^about:.+$/m
const tlds = tld
  .split('\n')
  .filter((tld) => tld.length > 0 && !tld.startsWith('#'))

/**
 * Checks if a query would match against the URL checker. For use with other
 * providers
 * @param query The query to check
 * @returns If the query is a url or not
 */
export function isUrlLike(query: string): boolean {
  if (
    ABOUT_REGEX.test(query) ||
    CHROME_REGEX.test(query) ||
    EXTENSION_REGEX.test(query)
  )
    return true
  const match = HTTPS_REGEX.exec(query)
  if (match === null) return false

  const { tld } = match.groups || {}

  // If it is not a valid tld, don't show it
  if (!tlds.includes(tld.toUpperCase())) return false
  return true
}

export class URLProvider extends Provider {
  public providerPriority = 0

  public async getResults(query: string): Promise<ProviderResult[]> {
    // Check against chrome urls
    if (
      CHROME_REGEX.test(query) ||
      ABOUT_REGEX.test(query) ||
      EXTENSION_REGEX.test(query)
    )
      return [
        {
          title: query,
          url: query,
          icon: `chrome://branding/content/icon32.png`,
          priority: ResultPriority.CRITICAL,
        },
      ]

    const match = HTTPS_REGEX.exec(query)
    if (match === null) return []

    const { protocol, domain, tld, path } = match.groups || {}
    const uri = `${protocol || 'https://'}${domain}${path || ''}`

    // If it is not a valid tld, don't show it
    if (!tlds.includes(tld.toUpperCase())) return []

    return [
      {
        title: uri,
        url: uri,
        icon: `chrome://branding/content/icon32.png`,
        priority: ResultPriority.CRITICAL,
      },
    ]
  }
}

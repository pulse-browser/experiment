/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @ts-check
import tld from '../data/tld.txt'

/**
 * @typedef {object} AutocompleteResult
 * @property {string} display
 * @property {string} url
 */

/**
 * Autocomplete that should take under a milisecond to evaluate. There will be
 * no debouncing on the user's input
 *
 * @param {string} input
 */
export function getFastAutocomplete(input) {
  if (input == '') return []

  return [...getUrlResults(input), ...getFastSearchResults(input)]
}

/**
 * @param {string} input
 */
export async function slowAutocomplete() {}

const HTTPS_REGEX =
  /^(?<protocol>https?:\/\/)?(?<domain>(\w+\.)+(?<tld>\w+))(?<path>\/.*)?$/m
const EXTENSION_REGEX = /^moz-extension:\/\/.+$/m
const CHROME_REGEX = /^chrome:\/\/.+$/m
const ABOUT_REGEX = /^about:.+$/m
const tlds = tld
  .split('\n')
  .filter((/** @type {string} */ tld) => tld.length > 0 && !tld.startsWith('#'))

/**
 * @param {string} input
 * @returns {AutocompleteResult[]}
 */
function getUrlResults(input) {
  // If it is an exact match against an internal url
  if (
    EXTENSION_REGEX.test(input) ||
    CHROME_REGEX.test(input) ||
    ABOUT_REGEX.test(input)
  ) {
    return [{ display: input, url: input }]
  }

  const match = HTTPS_REGEX.exec(input)
  if (match === null) return []

  const { protocol, domain, tld, path } = match.groups || {}
  const uri = `${protocol || 'https://'}${domain}${path || ''}`

  // If it is not a valid tld, don't show it
  if (!tlds.includes(tld.toUpperCase())) return []

  return [{ display: uri, url: uri }]
}

/**
 * @param {string} input
 * @returns {AutocompleteResult[]}
 */
function getFastSearchResults(input) {
  return [{ display: input, url: `https://duckduckgo.com/?q=${input}` }]
}

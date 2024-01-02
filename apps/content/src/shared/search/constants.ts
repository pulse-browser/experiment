/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export const DEFAULT_SEARCH_ENGINE: (typeof SEARCH_ENGINE_IDS)[number] =
  'google@search.fushra.com'
export const SEARCH_ENGINE_PREF = 'browser.search.engine.default'

export const SEARCH_ENGINE_IDS = [
  'ddg@search.fushra.com',
  'google@search.fushra.com',
] as const

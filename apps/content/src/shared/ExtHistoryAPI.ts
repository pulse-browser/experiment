/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { lazy } from './lazy'

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * @linkcode https://searchfox.org/mozilla-central/source/browser/components/extensions/parent/ext-history.js#253
 */
const executeAsyncQuery = <T>(
  historyQuery: nsINavHistoryQueryType,
  options: nsINavHistoryQueryOptionsType,
  resultConvertor: (result: mozIStorageRowType) => T,
): Promise<T[]> =>
  new Promise((resolve, reject) => {
    const results: T[] = []
    lazy.PlacesUtils.history.asyncExecuteLegacyQuery(historyQuery, options, {
      handleResult: (result: mozIStorageResultSetType) => {
        let row
        while ((row = result.getNextRow())) results.push(resultConvertor(row))
      },
      handleError: (error: mozIStorageErrorType) =>
        reject(
          new Error(
            `Async execution error (${error.result}): ${error.message}`,
          ),
        ),
      handleCompletion: () => resolve(results),
      // The generated types still include constants in the definition of this
      // interface, which we don't need to include here
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  })

/*
 * Converts a mozIStorageRow into a HistoryItem
 */
const convertRowToHistoryItem = (row: mozIStorageRowType): HistoryItem => ({
  id: row.getResultByName('guid'),
  url: row.getResultByName('url'),
  title: row.getResultByName('page_title'),
  lastVisitTime: lazy.PlacesUtils.toDate(
    row.getResultByName('last_visit_date'),
  ).getTime(),
  visitCount: row.getResultByName('visit_count'),
})

export function search({
  text,
  startTime = Date.now() - DAY_MS,
  endTime = Number.MAX_SAFE_INTEGER,
  maxResults = 100,
}: {
  text?: string
  startTime?: number
  endTime?: number
  maxResults?: number
}): Promise<HistoryItem[]> {
  if (startTime > endTime) {
    throw new Error('startTime cannot be greater than endTime')
  }

  // Converts to PRTime (microseconds since epoch)
  const beginTimePR = lazy.PlacesUtils.toPRTime(startTime)
  const endTimePR = lazy.PlacesUtils.toPRTime(endTime)

  const options = lazy.PlacesUtils.history.getNewQueryOptions()
  options.includeHidden = true
  options.maxResults = maxResults
  options.sortingMode = options.SORT_BY_DATE_DESCENDING

  const query = lazy.PlacesUtils.history.getNewQuery()
  if (text) query.searchTerms = text
  query.beginTime = beginTimePR
  query.endTime = endTimePR

  return executeAsyncQuery(query, options, convertRowToHistoryItem)
}

export function getVisits() {}

export function addUrl() {}

export function deleteUrl() {}

export function deleteRange() {}

export function deleteAll() {}

export const onTitleChanged = null
export const onVisited = null
export const onVisitRemoved = null

// =============================================================================
// Extension types

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/history/TransitionType}
 */
export type TransitionType =
  | 'link'
  | 'typed'
  | 'auto_bookmark'
  | 'auto_subframe'
  | 'manual_subframe'
  | 'generated'
  | 'auto_toplevel'
  | 'form_submit'
  | 'reload'
  | 'keyword'
  | 'keyword_generated'

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/history/HistoryItem}
 */
export interface HistoryItem {
  id: string
  url?: string
  title?: string
  lastVisitTime?: number
  visitCount?: number
  /** @deprecated - unimplemented in Gecko */
  typedCount?: number
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/history/VisitItem}
 */
export interface VisitItem {
  /**
   * This is the identifier of {@link HistoryItem}
   */
  id: string
  visitId: string
  visitTime?: number
  referringVisitId: string
  transition: TransitionType
}

// =============================================================================
// Gecko types

// interface GeckoVisitInfo {
//   date: Date
//   transition: number
//   referrer?: URL | nsIURIType | string
// }

// interface GeckoPageInfo {
//   guid: string
//   url: URL | nsIURIType | string
//   title?: string
//   description?: string
//   previewImageURL?: URL | nsIURIType | string
//   frequency?: number
//   visits?: GeckoVisitInfo[]
//   annotations?: Map<unknown, unknown>
// }

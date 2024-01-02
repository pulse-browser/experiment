/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import mitt from 'mitt'
import { type Readable, get, readable } from 'svelte/store'

import { lazy } from '../lazy.js'

/**
 * Based on the values defined inside of `historySidebar.js` inside of Firefox
 * @see {@link https://searchfox.org/mozilla-central/source/browser/components/places/content/historySidebar.js#104}
 */
export enum HistoryGroupType {
  /**
   * An item list with the most visited items up the top. There are no folders.
   */
  MostVisited = 'mostVisited',
  /** An item list with no folders & the last visited item first */
  LastVisited = 'lastVisited',
  /**
   * Similar to {@link HistoryGroupType.LastVisited}, except everything is
   * grouped into date subfolders
   */
  GroupByDate = 'groupByDate',
  /**
   * Similar to {@link HistoryGroupType.LastVisited}, except everything is
   * grouped into site subfolders
   */
  GroupBySite = 'groupBySite',
  /**
   * Similar to {@link HistoryGroupType.LastVisited}, except everything is
   * grouped into date subfolders at the top level, then site subfolders under
   * that
   */
  GroupBySiteAndDate = 'groupBySiteAndDate',
}

function getQuerySortingOptions(groupType: HistoryGroupType): {
  sortingMode: number | null
  resultType: number | null
} {
  const NHQO = Ci.nsINavHistoryQueryOptions

  let sortingMode: number | null = null
  let resultType: number | null = null

  switch (groupType) {
    case HistoryGroupType.MostVisited:
      resultType = NHQO.RESULTS_AS_URI
      sortingMode = NHQO.SORT_BY_VISITCOUNT_DESCENDING
      break
    case HistoryGroupType.LastVisited:
      resultType = NHQO.RESULTS_AS_URI
      sortingMode = NHQO.SORT_BY_DATE_DESCENDING
      break
    case HistoryGroupType.GroupByDate:
      resultType = NHQO.RESULTS_AS_DATE_QUERY
      sortingMode = NHQO.SORT_BY_DATE_DESCENDING
      break
    case HistoryGroupType.GroupBySite:
      resultType = NHQO.RESULTS_AS_SITE_QUERY
      sortingMode = NHQO.SORT_BY_DATE_DESCENDING
      break
    case HistoryGroupType.GroupBySiteAndDate:
      resultType = NHQO.RESULTS_AS_DATE_SITE_QUERY
      sortingMode = NHQO.SORT_BY_DATE_DESCENDING
      break
  }

  return { sortingMode, resultType }
}

export function setNodeOpened(
  node: nsINavHistoryContainerResultNodeType,
  opened = true,
) {
  node.containerOpen = opened
}

export function openAll(node: nsINavHistoryResultNodeType) {
  // @ts-expect-error Ci is not correctly typed
  if (node instanceof Ci.nsINavHistoryContainerResultNode) {
    const containerNode = node as nsINavHistoryContainerResultNodeType
    containerNode.containerOpen = true

    const nodes = containerNode.childCount
    for (let i = 0; i < nodes; i++) {
      openAll(containerNode.getChild(i))
    }
  }
}

export const searchableHistoryModel = (
  searchTerms: Readable<string>,
  groupType: Readable<HistoryGroupType>,
) => {
  const controller = new PlacesController()

  const callLoad = (searchTerms: string, groupType: HistoryGroupType) => {
    const hasSearchTerm = searchTerms != ''

    const query = lazy.PlacesUtils.history.getNewQuery()
    if (hasSearchTerm) query.searchTerms = searchTerms

    const options = lazy.PlacesUtils.history.getNewQueryOptions()

    const { sortingMode, resultType } = getQuerySortingOptions(groupType)
    if (sortingMode) options.sortingMode = sortingMode
    if (resultType) options.resultType = resultType
    options.includeHidden = hasSearchTerm

    controller.load(query, options)
  }

  return readable<{ root: nsINavHistoryContainerResultNodeType | null }>(
    { root: null },
    (set) => {
      controller.events.on('newResult', (result) => set({ root: result.root }))
      searchTerms.subscribe((searchTerms) =>
        callLoad(searchTerms, get(groupType)),
      )
      groupType.subscribe((groupType) => callLoad(get(searchTerms), groupType))

      callLoad(get(searchTerms), get(groupType))
    },
  )
}

export type PlacesSharedEvents = {
  newResult: nsINavHistoryResultType
}

/**
 * Similar in concept to Firefox's places tree view
 * @see {@link https://searchfox.org/mozilla-central/source/browser/components/places/content/treeView.js}
 */
class PlacesController {
  events = mitt<PlacesSharedEvents>()
  observer?: PlacesObserver

  load(query: nsINavHistoryQueryType, options: nsINavHistoryQueryOptionsType) {
    const observer = new PlacesObserver()
    observer.events.on('*', (event, ...args) =>
      this.events.emit(event, ...args),
    )

    const result = lazy.PlacesUtils.history.executeQuery(query, options)
    result.addObserver(observer)

    if (this.observer) this.observer.uninit()
    this.observer = observer
  }
}

class PlacesObserver implements nsINavHistoryResultObserverType {
  QueryInterface = ChromeUtils.generateQI([
    'nsINavHistoryResultObserver',
    'nsISupportsWeakReference',
  ])

  private _result: nsINavHistoryResultType | null = null
  events = mitt<PlacesSharedEvents>()
  skipHistoryDetailsNotifications = false

  get result(): nsINavHistoryResultType {
    return this._result!
  }

  set result(result: nsINavHistoryResultType) {
    if (this._result) {
      this._result.removeObserver(this)
    }

    this._result = result
    this.events.emit('newResult', result)
  }

  uninit() {
    if (this._result) this._result.removeObserver(this)
  }

  // Generated interface garbage

  nodeInserted(): void {}
  nodeRemoved(): void {}
  nodeMoved(): void {}
  nodeTitleChanged(): void {}
  nodeURIChanged(): void {}
  nodeIconChanged(): void {}
  nodeHistoryDetailsChanged(): void {}
  nodeTagsChanged(): void {}
  nodeKeywordChanged(): void {}
  nodeDateAddedChanged(): void {}
  nodeLastModifiedChanged(): void {}
  containerStateChanged(): void {}
  invalidateContainer(): void {}
  sortingChanged(): void {}
  batching(): void {}
}

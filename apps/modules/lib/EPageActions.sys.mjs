/// @ts-check
/// <reference types="@browser/link" />
import mitt from 'resource://app/modules/mitt.sys.mjs'

/**
 * @typedef {import('resource://app/modules/EPageActions.sys.mjs').PageActionImpl} PageActionImpl
 */

/** @implements {PageActionImpl} */
export class PageAction {
  /** @type {import('resource://app/modules/EPageActions.sys.mjs').PageActionImpl['events']} */
  events = mitt()

  tooltip
  popupUrl
  showMatches
  hideMatches
  /**
   * @type {Record<number, string>}
   */
  icons

  showTabIds = new Set()
  hideTabIds = new Set()

  /**
   * @param {import('resource://app/modules/EPageActions.sys.mjs').PageActionOptions<string[]>} data
   */
  constructor(data) {
    this.tooltip = data.tooltip
    this.popupUrl = data.popupUrl
    this.showMatches = new MatchPatternSet(data.showMatches || [])
    this.hideMatches = new MatchPatternSet(data.hideMatches || [])
  }

  /**
   * @param {string} url
   * @param {number} tabId
   * @returns {boolean}
   */
  shouldShow(url, tabId) {
    const urlMatch =
      this.showMatches.matches(url) &&
      !this.hideMatches.matches(url, true) &&
      !this.hideTabIds.has(tabId)
    const idMatch = this.showTabIds.has(tabId)

    return urlMatch || idMatch
  }

  /**
   * @param {Record<number, string>} icons
   */
  setIcons(icons) {
    this.icons = icons
    this.events.emit('updateIcon', icons)
  }

  /**
   * @param {number} id
   */
  addShow(id) {
    this.showTabIds.add(id)
    this.hideTabIds.delete(id)
  }

  /**
   * @param {number} id
   */
  addHide(id) {
    this.hideTabIds.add(id)
    this.showTabIds.delete(id)
  }
}

/** @type {import('resource://app/modules/EPageActions.sys.mjs')['EPageActions']} */
export const EPageActions = {
  /** @type {import('resource://app/modules/EPageActions.sys.mjs')['EPageActions']['events']} */
  events: mitt(),

  PageAction,
  pageActions: new Map(),

  /**
   * @param {string} extensionId
   * @param {PageAction} pageAction
   */
  registerPageAction(extensionId, pageAction) {
    if (EPageActions.pageActions.has(extensionId)) {
      EPageActions.removePageAction(extensionId)
    }

    EPageActions.pageActions.set(extensionId, pageAction)
    EPageActions.events.emit('register', {
      action: pageAction,
      extension: extensionId,
    })
  },

  /**
   * @param {string} extensionId
   */
  removePageAction(extensionId) {
    const action = EPageActions.pageActions.get(extensionId)
    if (!action) return

    EPageActions.pageActions.delete(extensionId)
    EPageActions.events.emit('remove', { action, extension: extensionId })
  },
}

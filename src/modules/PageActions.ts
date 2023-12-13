/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/// <reference path="../link.d.ts" />
import mitt from 'resource://app/modules/mitt.sys.mjs'

export type PageActionEvents = {
  register: {
    extension: string
    action: PageAction
  }

  remove: {
    extension: string
    action: PageAction
  }
}

/**
 * The following features are not going to be supported, primarily because I see
 * no good reason for including support
 * - `browser_style`: There is no documentation for this, provide a browser
 *                    style component library instead
 * - `pinned`: For the moment, I don't feel like pinning page actions
 *
 * @todo analytics to see how many page actions people have. If there are a few
 *       power users, we might want to implement `pinned`
 */
export interface PageActionOptions {
  /**
   * The tooltip displayed when the user hovers over the action button.
   *
   * @key `default_title`
   */
  tooltip: string

  /**
   * The url of the popup to show when the icon is clicked. If this url does not
   * exist, clicking the icon will send an event back to the extension.
   */
  popupUrl?: string

  /**
   * @key `show_matches`
   */
  showMatches?: string[]

  /**
   * @key `hide_matches`
   */
  hideMatches?: string[]
}

export class PageAction implements PageActionOptions {
  tooltip: string
  popupUrl?: string | undefined
  showMatches?: string[] | undefined
  hideMatches?: string[] | undefined

  constructor(data: PageActionOptions) {
    this.tooltip = data.tooltip
    this.popupUrl = data.popupUrl
    this.showMatches = data.showMatches
    this.hideMatches = data.hideMatches
  }
}

export const PageActions = {
  events: mitt<PageActionEvents>(),

  pageActions: new Map<string, PageAction>(),

  registerPageAction(extensionId: string, pageAction: PageAction) {
    if (PageActions.pageActions.has(extensionId)) {
      PageActions.removePageAction(extensionId)
    }

    PageActions.pageActions.set(extensionId, pageAction)
    PageActions.events.emit('register', {
      action: pageAction,
      extension: extensionId,
    })
  },

  removePageAction(extensionId: string) {
    const action = PageActions.pageActions.get(extensionId)
    if (!action) return

    PageActions.pageActions.delete(extensionId)
    PageActions.events.emit('remove', { action, extension: extensionId })
  },
}

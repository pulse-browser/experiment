/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/// <reference path="../link.d.ts" />
import mitt from 'resource://app/modules/mitt.sys.mjs'

export type PageActionsEvents = {
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
export interface PageActionOptions<PS = MatchPatternSet> {
  /**
   * The tooltip displayed when the user hovers over the action button.
   *
   * @key `default_title`
   */
  tooltip?: string

  /**
   * The url of the popup to show when the icon is clicked. If this url does not
   * exist, clicking the icon will send an event back to the extension.
   *
   * @key `default_popup`
   */
  popupUrl?: string

  /**
   * @key `show_matches`
   */
  showMatches?: PS

  /**
   * @key `hide_matches`
   */
  hideMatches?: PS

  icons?: Record<number, string>
}

export type PageActionEvents = {
  updateIcon: Record<number, string> | undefined
  click: { clickData: { modifiers: string[]; button: number } }
}

export class PageAction implements PageActionOptions {
  events = mitt<PageActionEvents>()

  tooltip?: string
  popupUrl?: string
  showMatches: MatchPatternSet
  hideMatches: MatchPatternSet
  icons?: Record<number, string>

  constructor(data: PageActionOptions<string[]>) {
    this.tooltip = data.tooltip
    this.popupUrl = data.popupUrl
    this.showMatches = new MatchPatternSet(data.showMatches || [])
    this.hideMatches = new MatchPatternSet(data.hideMatches || [])
  }

  shouldShow(url: string) {
    return this.showMatches.matches(url) && !this.hideMatches.matches(url, true)
  }

  setIcons(icons: Record<number, string>) {
    this.icons = icons
    this.events.emit('updateIcon', icons)
  }
}

export const EPageActions = {
  events: mitt<PageActionsEvents>(),

  PageAction,
  pageActions: new Map<string, PageAction>(),

  registerPageAction(extensionId: string, pageAction: PageAction) {
    if (EPageActions.pageActions.has(extensionId)) {
      EPageActions.removePageAction(extensionId)
    }

    EPageActions.pageActions.set(extensionId, pageAction)
    EPageActions.events.emit('register', {
      action: pageAction,
      extension: extensionId,
    })
  },

  removePageAction(extensionId: string) {
    const action = EPageActions.pageActions.get(extensionId)
    if (!action) return

    EPageActions.pageActions.delete(extensionId)
    EPageActions.events.emit('remove', { action, extension: extensionId })
  },
}

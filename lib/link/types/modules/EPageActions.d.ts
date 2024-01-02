declare module 'resource://app/modules/EPageActions.sys.mjs' {
  import type { Emitter } from 'mitt'

  export type PageActionsEvents = {
    register: {
      extension: string
      action: PageActionImpl
    }

    remove: {
      extension: string
      action: PageActionImpl
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

  export class PageActionImpl implements PageActionOptions {
    events: Emitter<PageActionEvents>

    tooltip?: string
    popupUrl?: string
    showMatches?: MatchPatternSet
    hideMatches?: MatchPatternSet
    icons?: Record<number, string>
    showTabIds: Set<number>
    hideTabIds: Set<number>

    constructor(data: PageActionOptions<string[]>)

    shouldShow(url: string, tabId: number): boolean
    setIcons(icon: Record<number, string>): void
    addShow(id: number): void
    addHide(id: number): void
  }

  export const PageAction: typeof PageActionImpl

  export const EPageActions: {
    events: Emitter<PageActionsEvents>
    PageAction: typeof PageActionImpl
    pageActions: Map<string, PageActionImpl>

    registerPageAction(extension: string, action: PageActionImpl): void
    removePageAction(extension: string): void
  }
}

declare interface MozESMExportFile {
  EPageActions: 'resource://app/modules/EPageActions.sys.mjs'
}

declare interface MozESMExportType {
  EPageActions: typeof import('resource://app/modules/EPageActions.sys.mjs').EPageActions
}

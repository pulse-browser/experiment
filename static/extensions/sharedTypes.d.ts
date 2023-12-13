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
export type PageAction = {
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
   * @key `show_matches
   */
  showMatches?: string[]

  /**
   * @key `hide_matches`
   */
  hideMatches?: string[]
}

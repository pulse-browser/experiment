/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @ts-check
/// <reference types="@browser/link" />

export class ClickHandlerChild extends JSWindowActorChild {
  /**
   * @param {Node} target
   * @returns {string | undefined}
   */
  getHrefIfExists(target) {
    /** @type {HTMLAnchorElement} */
    // @ts-expect-error We cant cast with as, so this is how I am casting :/
    const asAnchor = target

    if (asAnchor.href) {
      return asAnchor.href
    }

    if (target.parentElement) {
      return this.getHrefIfExists(target.parentElement)
    }
  }

  /**
   * @param {MouseEvent & { target: Node }} event
   */
  handleEvent(event) {
    if (event.defaultPrevented || !event.target) return

    const href = this.getHrefIfExists(event.target)

    const ctrlClick = event.button === 0 && event.ctrlKey
    const middleClick = event.button === 1

    const shouldOpenNewTab = href && (ctrlClick || middleClick)

    if (!shouldOpenNewTab) return

    this.sendAsyncMessage('openlink', { href })
  }
}

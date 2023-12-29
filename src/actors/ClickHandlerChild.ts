/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/// <reference path="../link.d.ts" />

export type ClickHandlerMessage = {
  name: 'openlink'
  data: { href: string }
} & { target: JSWindowActorParent }

export class ClickHandlerChild extends JSWindowActorChild {
  getHrefIfExists(target: Node): string | undefined {
    if ((target as HTMLAnchorElement).href) {
      return (target as HTMLAnchorElement).href
    }

    if (target.parentElement) {
      return this.getHrefIfExists(target.parentElement)
    }
  }

  handleEvent(event: MouseEvent) {
    if (event.defaultPrevented || !event.target) return

    const href = this.getHrefIfExists(event.target as Node)

    const ctrlClick = event.button === 0 && event.ctrlKey
    const middleClick = event.button === 1

    const shouldOpenNewTab = href && (ctrlClick || middleClick)

    if (!shouldOpenNewTab) return

    this.sendAsyncMessage('openlink', { href })
  }
}

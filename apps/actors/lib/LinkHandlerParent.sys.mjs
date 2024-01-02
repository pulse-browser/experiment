/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @ts-check
/// <reference types="@browser/link" />

export class LinkHandlerParent extends JSWindowActorParent {
  /** @param {{ name: 'Link:SetIcon'; data: { iconURL: string } }} aMsg */
  receiveMessage(aMsg) {
    const win = this.browsingContext.topChromeWindow

    switch (aMsg.name) {
      case 'Link:SetIcon':
        return win.windowApi.tabs.setIcon(
          this.browsingContext.embedderElement,
          aMsg.data.iconURL,
        )
    }
  }
}

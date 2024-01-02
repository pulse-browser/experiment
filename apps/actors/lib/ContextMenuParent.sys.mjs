/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @ts-check
/// <reference types="@browser/link" />

export class ContextMenuParent extends JSWindowActorParent {
  /** @param {ContextMenuEvent} event */
  receiveMessage(event) {
    if (event.name == 'contextmenu') {
      const win = event.target.browsingContext.embedderElement.ownerGlobal
      win.windowApi.contextMenu.showContextMenu(event.data, this)
    }
  }
}

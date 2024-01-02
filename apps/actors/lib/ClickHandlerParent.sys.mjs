/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @ts-check
/// <reference types="@browser/link" />

export class ClickHandlerParent extends JSWindowActorParent {
  /**
   * @param {ClickHandlerMessage} event
   */
  receiveMessage(event) {
    if (event.name == 'openlink') {
      const win = event.target.browsingContext.embedderElement.ownerGlobal
      const uri = Services.io.newURI(event.data.href)
      win.windowApi.tabs.openTab(uri)
    }
  }
}

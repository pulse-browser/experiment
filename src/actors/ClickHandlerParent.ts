/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/// <reference path="../link.d.ts" />
import { ClickHandlerMessage } from './ClickHandlerChild'

export class ClickHandlerParent extends JSWindowActorParent {
  receiveMessage(event: ClickHandlerMessage) {
    if (event.name == 'openlink') {
      const win = event.target.browsingContext.embedderElement.ownerGlobal
      const uri = Services.io.newURI(event.data.href)
      win.windowApi.tabs.openTab(uri)
    }
  }
}

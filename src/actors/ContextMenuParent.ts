/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import type { ContextMenuInfo } from './ContextMenu.types'

type ContextMenuEvent = {
  name: 'contextmenu'
  data: ContextMenuInfo
  target: ContextMenuParent
}

export class ContextMenuParent extends JSWindowActorParent {
  receiveMessage(event: ContextMenuEvent) {
    if (event.name == 'contextmenu') {
      const win = event.target.browsingContext.embedderElement.ownerGlobal
      win.windowApi.showContextMenu(event.data, this)
    }
  }
}

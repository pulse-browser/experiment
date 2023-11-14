/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/// <reference path="../link.d.ts" />
import { lazyESModuleGetters } from 'resource://app/modules/TypedImportUtils.sys.mjs'

import type { ContextMenuInfo } from './ContextMenu.types'

const lazy = lazyESModuleGetters({
  SelectionUtils: 'resource://gre/modules/SelectionUtils.sys.mjs',
})

export class ContextMenuChild extends JSWindowActorChild {
  handleEvent(event: MouseEvent & { inputSource: number }) {
    const data: {
      position: ContextMenuInfo['position']
    } & Partial<ContextMenuInfo> = {
      position: {
        screenX: event.screenX,
        screenY: event.screenY,
        inputSource: event.inputSource,
      },
    }

    const selectionInfo = lazy.SelectionUtils.getSelectionDetails(
      this.contentWindow,
    )
    if (selectionInfo.fullText) {
      data.textSelection = selectionInfo.fullText
    }

    this.sendAsyncMessage('contextmenu', data satisfies ContextMenuInfo)
  }
}

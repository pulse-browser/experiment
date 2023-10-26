import { lazyESModuleGetters } from 'resource://app/modules/TypedImportUtils.sys.mjs'
import type { ContextMenuInfo } from './ContextMenu.types'

const lazy = lazyESModuleGetters({
  SelectionUtils: 'resource://gre/modules/SelectionUtils.sys.mjs',
})

export class ContextMenuChild extends JSWindowActorChild {
  handleEvent(event) {
    console.log('ContextMenu', event)
    let data: {
      position: ContextMenuInfo['position']
    } & Partial<ContextMenuInfo> = {
      position: {
        screenX: event.screenX as number,
        screenY: event.screenY as number,
        inputSource: event.inputSource as number,
      },
    }

    const selectionInfo = lazy.SelectionUtils.getSelectionDetails(
      this.contentWindow,
    )
    if (selectionInfo.fullText) {
      data.textSelection = selectionInfo.fullText
    }

    this.sendAsyncMessage('contentmenu', data satisfies ContextMenuInfo)
  }
}

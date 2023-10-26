import type { ContextMenuInfo } from './ContextMenu.types'

export class ContextMenuParent extends JSWindowActorParent {
  receiveMessage(event) {
    console.log(event)
    if (event.name == 'contentmenu') {
      const data: ContextMenuInfo = event.data
      const win = (event.target as ContextMenuParent).browsingContext
        .embedderElement.ownerGlobal
      win.windowApi.showContextMenu(data)
    }
  }
}

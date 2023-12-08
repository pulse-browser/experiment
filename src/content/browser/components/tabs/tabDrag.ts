import type { Action } from 'svelte/action'
import { type Readable, type Writable, writable } from 'svelte/store'

import type { Tab } from '@browser/lib/window/tab'
import { moveTabAfter, moveTabBefore } from '@browser/lib/window/tabs'

export const TAB_DATA_TYPE = 'experiment/tab'

const dragOver = (
  tab: Tab,
  dropBefore: Writable<boolean>,
  dropAfter: Writable<boolean>,
) => {
  let lastDragIsBefore: boolean | undefined

  return (event: DragEvent) => {
    const currentTarget = event.currentTarget as HTMLDivElement
    const rawDragRepresentation = event.dataTransfer?.getData(TAB_DATA_TYPE)

    if (!currentTarget.classList.contains('tab')) return
    if (!rawDragRepresentation) {
      console.warn('No drag representation')
      return
    }

    const { windowId, tabId } = JSON.parse(rawDragRepresentation) as ReturnType<
      Tab['getDragRepresentation']
    >
    const sameWindow = windowId === window.windowApi.id

    const boundingRect = currentTarget.getBoundingClientRect()
    const xMiddle = boundingRect.x + boundingRect.width / 2
    const isBefore = event.x <= xMiddle

    if ((tabId == tab.getId() && sameWindow) || lastDragIsBefore === isBefore)
      return
    lastDragIsBefore = isBefore

    if (!sameWindow) {
      console.warn('Tab is from a different window')

      dropBefore.set(isBefore)
      dropAfter.set(!isBefore)

      return
    }

    dropBefore.set(false)
    dropAfter.set(false)

    event.preventDefault()
    event.stopPropagation()
    if (isBefore) moveTabBefore(tabId, tab.getId())
    else moveTabAfter(tabId, tab.getId())
  }
}

export function createTabDrag(tab: Tab) {
  const dropBefore = writable(false)
  const dropAfter = writable(false)

  const dragOverEvent = dragOver(tab, dropBefore, dropAfter)
  const setDataTransferEvent = (event: DragEvent) =>
    event.dataTransfer?.setData(
      TAB_DATA_TYPE,
      JSON.stringify(tab.getDragRepresentation()),
    )
  const dragLeaveEvent = () => {
    dropBefore.set(false)
    dropAfter.set(false)
  }

  const tabDrag: Action<HTMLDivElement> = (node) => {
    const initialDraggable = node.draggable
    node.draggable = true

    node.addEventListener('dragstart', setDataTransferEvent)
    node.addEventListener('dragover', dragOverEvent)
    node.addEventListener('dragleave', dragLeaveEvent)

    return {
      destroy() {
        node.removeEventListener('dragstart', setDataTransferEvent)
        node.removeEventListener('dragover', dragOverEvent)
        node.removeEventListener('dragleave', dragLeaveEvent)

        node.draggable = initialDraggable
      },
    }
  }

  return {
    tabDrag,
    drop: {
      before: dropBefore satisfies Readable<boolean>,
      after: dropAfter satisfies Readable<boolean>,
    },
  }
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import type { Action } from 'svelte/action'
import { type Readable, type Writable, get, writable } from 'svelte/store'

import { spinLock } from '@browser/lib/spinlock'
import type { Tab } from '@browser/lib/window/tab'
import {
  ABOUT_BLANK,
  moveTabAfter,
  moveTabBefore,
  openTab,
} from '@browser/lib/window/tabs'
import { getWindowById } from '@browser/lib/window/window'

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

      // Trigger the drop handler
      event.preventDefault()

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

const drop = (tab: Tab) => async (event: DragEvent) => {
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

  if (sameWindow) return

  event.preventDefault()
  event.stopPropagation()

  const toMoveWindow = getWindowById(windowId)
  if (!toMoveWindow) {
    console.warn('Window not found')
    return
  }

  const tabToMove = toMoveWindow.windowApi.tabs.getTabById(tabId)
  if (!tabToMove) {
    console.warn('Tab not found')
    return
  }

  // We need to do the following to change a tab between windows:
  // 1. Create a donor tab in our current window
  // 2. Wait for teh donor tab to finish initializing
  // 3. Perform a docshell swap with the donor tab
  // 4. Destroy the tab to move
  // 5. Show the donor tab

  console.log('attempting swap...')
  const donorTab = openTab(ABOUT_BLANK)
  donorTab.hidden.set(true)
  await donorTab.goToUri(ABOUT_BLANK)
  await spinLock(() => !get(donorTab.loading))

  donorTab.swapWithTab(tabToMove)
  donorTab.hidden.set(false)

  toMoveWindow.windowApi.tabs.closeTab(tabToMove)
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
  const preventDefault = (event: DragEvent) => event.preventDefault()
  const onDrop = drop(tab)

  const tabDrag: Action<HTMLDivElement> = (node) => {
    const initialDraggable = node.draggable
    node.draggable = true

    node.addEventListener('dragstart', setDataTransferEvent)
    node.addEventListener('dragover', dragOverEvent)
    node.addEventListener('dragleave', dragLeaveEvent)
    node.addEventListener('drop', preventDefault)
    node.addEventListener('drop', onDrop)

    return {
      destroy() {
        node.draggable = initialDraggable

        node.removeEventListener('dragstart', setDataTransferEvent)
        node.removeEventListener('dragover', dragOverEvent)
        node.removeEventListener('dragleave', dragLeaveEvent)
        node.removeEventListener('drop', preventDefault)
        node.removeEventListener('drop', onDrop)
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

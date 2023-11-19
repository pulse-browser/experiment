import curry from 'fnts/curry'
import { nanoid } from 'nanoid'
import { type Readable, readable } from 'svelte/store'

import type {
  BlockComponent,
  BlockDirection,
  BlockSize,
  BrowserComponent,
  Component,
  ComponentId,
  IconComponent,
  SpacerComponent,
  TempDropTargetComponent,
} from '.'
import type { Tab } from '../../browser/components/tabs/tab'

export const createBlock = (
  direction: BlockDirection = 'horizontal',
  content: Component[] = [],
  size: BlockSize = { type: 'content' },
): ComponentId & BlockComponent => ({
  id: nanoid(),
  type: 'block',
  direction,
  content,
  size,
})

export const createIcon = (
  icon: string,
  action: (tab: Tab) => void = () => {},
  enabled: (tab: Tab) => Readable<boolean> = () => readable(true),
): ComponentId & IconComponent => ({
  id: nanoid(),
  type: 'icon',
  icon,
  enabled,
  action,
})

export const tempDropTarget = (
  parent: string,
): ComponentId & TempDropTargetComponent => ({
  id: nanoid(),
  type: 'temp-drop-target',
  parent,
})

export const createSpacer = (grow = 1): ComponentId & SpacerComponent => ({
  id: nanoid(),
  type: 'spacer',
  grow,
})

export const createBrowser = (): ComponentId & BrowserComponent => ({
  id: nanoid(),
  type: 'browser',
})

export function findChildWithId(
  component: Component,
  id: string,
): Component | null {
  if (component.id === id) {
    return component
  }

  if (component.type === 'block') {
    return component.content.reduce<Component | null>(
      (acc, item) => acc ?? findChildWithId(item, id),
      null,
    )
  }

  return null
}

export function getParent(
  root: Component,
  self: Component,
): BlockComponent | null {
  if (root === self) {
    return null
  }

  if (root.type === 'block') {
    if (self.type === 'temp-drop-target')
      return findChildWithId(root, self.parent) as BlockComponent | null

    if (root.content.some((item) => item.id === self.id)) {
      return root
    }

    return root.content.reduce<BlockComponent | null>(
      (acc, item) => acc ?? getParent(item, self),
      null,
    )
  }

  return null
}

export function getParentOrientation(
  root: Component,
  self: Component,
): BlockDirection {
  return getParent(root, self)?.direction ?? 'horizontal'
}

export function calculateDropTargetRel(
  parentOrientation: BlockDirection,
  dragEvent: DragEvent & { currentTarget: HTMLDivElement & EventTarget },
): 'before' | 'after' | null {
  const boundingRect = dragEvent.currentTarget.getBoundingClientRect()
  const x = dragEvent.x
  const y = dragEvent.y

  if (parentOrientation === 'horizontal') {
    const middle = boundingRect.x + boundingRect.width / 2
    return x < middle ? 'before' : 'after'
  }

  const middle = boundingRect.y + boundingRect.height / 2
  return y < middle ? 'before' : 'after'
}

export function applyDrop(
  root: Component,
  toMove: Component,
  dropTarget: Component,
  rel: 'before' | 'after',
) {
  const dropTargetParent = getParent(root, dropTarget)
  const toMoveParent = getParent(root, toMove)

  // Remote from old parent
  if (toMoveParent) {
    const toMoveIndex = toMoveParent.content.findIndex(
      (item) => item.id === toMove.id,
    )
    toMoveParent.content.splice(toMoveIndex, 1)
  }

  // Add to new parent
  if (dropTargetParent) {
    let dropIndex =
      dropTargetParent.content.findIndex((item) => item.id === dropTarget.id) +
      (rel === 'before' ? 0 : 1)
    if (dropIndex == -1) dropIndex = 0 // Void drop indexes
    dropTargetParent.content.splice(dropIndex, 0, toMove)
  }
}

export function isParent(parent: Component, child: Component): boolean {
  if (parent.id === child.id) {
    return true
  }

  if (parent.type === 'block') {
    return parent.content.some((item) => isParent(item, child))
  }

  return false
}

export const countChildrenWithType = curry(
  (type: Component['type'], root: Component): number => {
    let childrenCount = (root.type === 'block' ? root.content : [])
      .map(countChildrenWithType(type))
      .reduce((acc, count) => acc + count, 0)

    if (root.type === type) childrenCount++

    return childrenCount
  },
)

export const updateComponentById = curry(
  (
    root: Component,
    id: string,
    updater: (component: Component) => Component,
  ): Component => {
    if (root.id === id) {
      return updater(root)
    }

    if (root.type === 'block') {
      return {
        ...root,
        content: root.content.map((item) =>
          updateComponentById(item, id, updater),
        ),
      }
    }

    return root
  },
)

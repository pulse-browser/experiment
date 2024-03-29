/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { dynamicStringPref } from '@experiment/shared'
import curry from 'fnts/curry'
import { nanoid } from 'nanoid'
import { type Readable, readable } from 'svelte/store'

import {
  type BlockComponent,
  type BlockDirection,
  type BlockSize,
  type BrowserComponent,
  type Component,
  type ComponentId,
  type ExportComponent,
  type IconComponent,
  type SpacerComponent,
  type TempDropTargetComponent,
  cuiPreviewItems,
} from '.'
import type { Tab } from '../../browser/lib/window/tab'

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
  color: 'base',
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
  root: BlockComponent & ComponentId,
  toMove: Component,
  dropTarget: Component,
  rel: 'before' | 'after',
) {
  const isRootDrop = dropTarget.id === root.id
  let dropTargetParent = getParent(root, dropTarget)
  const toMoveParent = getParent(root, toMove)

  if (isRootDrop) dropTargetParent = root

  // Remote from old parent
  if (toMoveParent && !isRootDrop) {
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

export const removeChildById = curry(
  (id: string, root: Component): Component => {
    if (root.type === 'block') {
      return {
        ...root,
        content: root.content
          .filter((item) => item.id !== id)
          .map(removeChildById(id)),
      }
    }

    return root
  },
)

export function toExportType(component: Component): ExportComponent {
  const output = { ...component } as ExportComponent & { id?: string }
  delete output.id

  if (output.type === 'block') {
    return {
      ...output,
      // @ts-expect-error The types here are not perfectly setup
      content: output.content.map(toExportType),
    }
  }

  return output
}

export function fromExportType(component: ExportComponent): Component {
  if (!component.type)
    return createBlock('vertical', [], { type: 'grow', value: 1 })

  const output = { ...component, id: nanoid() } as Component

  if (output.type === 'block')
    output.content = output.content.map(fromExportType)

  return output
}

const fromExportTypeStableInternal =
  (parentId: string) =>
  (component: ExportComponent, index: number): Component => {
    if (!component.type)
      return createBlock('vertical', [], { type: 'grow', value: 1 })

    const id = `${parentId}-${index}`
    const output = { ...component, id } as Component

    if (output.type === 'block')
      output.content = output.content.map(fromExportTypeStableInternal(id))

    // Icons have non-serializable properties that need to be loaded in
    if (output.type === 'icon') {
      const predefinedItem = cuiPreviewItems.find(
        (existingItem) =>
          existingItem.component.type === 'icon' &&
          existingItem.component.icon === output.icon,
      )?.component as IconComponent | undefined

      output.action = predefinedItem?.action ?? (() => {})
      output.enabled = predefinedItem?.enabled ?? (() => readable(false))
    }

    return output
  }

/**
 * A variant of {@link fromExportType} that uses index based IDs instead of
 * random ids
 *
 * It also performs extra initialization steps that are required for use in the
 * browser
 */
export const fromExportTypeStable = (component: ExportComponent) =>
  fromExportTypeStableInternal('root')(component, 0)

export const customizableUIDynamicPref = dynamicStringPref((json) => {
  console.log('test', json)
  return fromExportTypeStable(JSON.parse(json) as ExportComponent)
})

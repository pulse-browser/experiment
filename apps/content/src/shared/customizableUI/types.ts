/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import type { Readable } from 'svelte/store'

import type { Tab } from '../../browser/lib/window/tab'

export type BlockSize =
  | { type: 'grow'; value: number }
  | { type: 'fixed'; value: number }
  | { type: 'content' }
export const surfaceColors = [
  'crust',
  'mantle',
  'base',
  'surface-0',
  'surface-1',
  'surface-2',
] as const
export type SurfaceColors = (typeof surfaceColors)[number]
export type BlockDirection = 'horizontal' | 'vertical'
export interface BlockComponent {
  type: 'block'
  direction: BlockDirection
  content: Component[]
  size: BlockSize
  color: SurfaceColors
}

export interface IconComponent {
  type: 'icon'
  icon: string
  enabled: (tab: Tab) => Readable<boolean>
  action: (tab: Tab, button: HTMLElement) => void
}

export interface TempDropTargetComponent {
  type: 'temp-drop-target'
  parent: string
}

export interface SpacerComponent {
  type: 'spacer'
  grow: number
}

export interface BrowserComponent {
  type: 'browser'
}

export interface OmniboxComponent {
  type: 'omnibox'
}

export interface TabsComponent {
  type: 'tabs'
}

export interface ExportComponentMap {
  block: BlockComponent
  icon: IconComponent
  'temp-drop-target': TempDropTargetComponent
  spacer: SpacerComponent
  browser: BrowserComponent
  omnibox: OmniboxComponent
  tabs: TabsComponent
}

export type ComponentMapKeys = keyof ExportComponentMap
export type ExportComponent = ExportComponentMap[ComponentMapKeys]

export type ComponentId = { id: string }
export type Component = ComponentId & ExportComponentMap[ComponentMapKeys]

export type PrefType =
  | { type: 'string'; options?: readonly string[] }
  | { type: 'number'; range?: [number, number]; steps?: number }
  | { type: 'block-size' }
export const prefs: {
  [k in ExportComponent['type']]: ({
    key: keyof Omit<ExportComponentMap[k], 'type'>
  } & PrefType)[]
} = {
  block: [
    { key: 'direction', type: 'string', options: ['horizontal', 'vertical'] },
    { key: 'size', type: 'block-size' },
    { key: 'color', type: 'string', options: surfaceColors },
  ],
  icon: [],
  'temp-drop-target': [],
  spacer: [{ key: 'grow', type: 'number' }],
  browser: [],
  omnibox: [],
  tabs: [],
}

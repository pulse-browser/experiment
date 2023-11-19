import type { Readable } from 'svelte/store'

import type { Tab } from '../../browser/components/tabs/tab'

export type BlockSize =
  | { type: 'grow'; value: number }
  | { type: 'fixed'; value: number }
  | { type: 'content' }
export type BlockDirection = 'horizontal' | 'vertical'
export interface BlockComponent {
  type: 'block'
  direction: BlockDirection
  content: Component[]
  size: BlockSize
}

export interface IconComponent {
  type: 'icon'
  icon: string
  enabled: (tab: Tab) => Readable<boolean>
  action: (tab: Tab) => void
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

export type ExportComponentMap = {
  block: BlockComponent
  icon: IconComponent
  'temp-drop-target': TempDropTargetComponent
  spacer: SpacerComponent
  browser: BrowserComponent
  omnibox: OmniboxComponent
}
export type ExportComponent = ExportComponentMap[keyof ExportComponentMap]

export type ComponentId = { id: string }
export type Component = ComponentId & ExportComponent

export type PrefType =
  | { type: 'string'; options?: string[] }
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
  ],
  icon: [],
  'temp-drop-target': [],
  spacer: [{ key: 'grow', type: 'number' }],
  browser: [],
  omnibox: [],
}

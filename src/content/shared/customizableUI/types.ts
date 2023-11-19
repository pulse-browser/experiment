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

export type ExportComponent =
  | BlockComponent
  | IconComponent
  | TempDropTargetComponent
  | SpacerComponent
  | BrowserComponent
  | OmniboxComponent

export type ComponentId = { id: string }
export type Component = ComponentId & ExportComponent

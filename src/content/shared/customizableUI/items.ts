import { readable } from 'svelte/store'

import type { Component, ExportComponent } from '.'
import { countChildrenWithType } from './helpers'

export interface CUIPreviewItem {
  component: ExportComponent
  canAdd: (root: Component) => boolean
}

const ALWAYS_ADD = () => true
const ALWAYS_ENABLE = () => readable(true)

export const cuiPreviewItems: CUIPreviewItem[] = [
  {
    canAdd: ALWAYS_ADD,
    component: {
      type: 'block',
      direction: 'horizontal',
      size: { type: 'content' },
      content: [],
      color: 'base',
    },
  },
  {
    canAdd: ALWAYS_ADD,
    component: { type: 'spacer', grow: 1 },
  },
  {
    canAdd: (root) => countChildrenWithType('browser', root) === 0,
    component: { type: 'browser' },
  },
  {
    canAdd: ALWAYS_ADD,
    component: {
      type: 'icon',
      icon: 'arrow-left-line',
      enabled: (tab) => tab.canGoBack,
      action: (tab) => tab.goBack(),
    },
  },
  {
    canAdd: ALWAYS_ADD,
    component: {
      type: 'icon',
      icon: 'arrow-right-line',
      enabled: (tab) => tab.canGoForward,
      action: (tab) => tab.goForward(),
    },
  },
  {
    canAdd: ALWAYS_ADD,
    component: {
      type: 'icon',
      icon: 'refresh-line',
      enabled: ALWAYS_ENABLE,
      action: (tab) => tab.reload(),
    },
  },
  {
    canAdd: ALWAYS_ADD,
    component: {
      type: 'icon',
      icon: 'add-line',
      enabled: ALWAYS_ENABLE,
      action: () => window.windowApi.openTab(),
    },
  },
  {
    canAdd: ALWAYS_ADD,
    component: {
      type: 'icon',
      icon: 'menu-line',
      enabled: ALWAYS_ENABLE,
      action: () => {
        /* TODO */
      },
    },
  },
  {
    canAdd: ALWAYS_ADD,
    component: {
      type: 'omnibox',
    },
  },
  {
    canAdd: ALWAYS_ADD,
    component: { type: 'tabs' },
  },
]

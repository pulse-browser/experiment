import { type Readable, readable } from 'svelte/store'

import type { ContextMenuInfo } from '../../../actors/ContextMenu.types'
import { openTab, setCurrentTab } from '../../browser/lib/globalApi'
import { resource } from '../../browser/lib/resources'
import { getClipboardHelper } from '../../browser/lib/xul/ccWrapper'
import { observable } from '../../browser/lib/xul/observable'

/**
 * All of the valid menu item IDs. Note that it must not include 'separator'
 */
export const MENU_ITEM_ACTION_IDS = [
  'selection__copy',
  'link__copy',
  'link__new-tab',
] as const

const HAS_TEXT_SELECTION: VisibilityCheck = (info) =>
  typeof info.textSelection == 'string'
const HAS_HREF: VisibilityCheck = (info) => typeof info.href == 'string'

export const MENU_ITEM_ACTIONS: MenuItemAction[] = [
  {
    type: 'action',
    id: 'selection__copy',
    title: 'Copy',

    visible: HAS_TEXT_SELECTION,
    action: (info) => {
      const clipboardHelper = getClipboardHelper()
      if (info.textSelection) clipboardHelper.copyString(info.textSelection, 0)
    },
  },
  {
    type: 'action',
    id: 'link__copy',
    title: 'Copy Link',

    visible: HAS_HREF,
    action(info) {
      const clipboardHelper = getClipboardHelper()
      if (info.href) clipboardHelper.copyString(info.href, 0)
    },
  },
  {
    type: 'action',
    id: 'link__new-tab',
    title: 'Open Link in New Tab',

    visible: HAS_HREF,
    action(info) {
      const tab = openTab(resource.NetUtil.newURI(info.href!))
      if (Services.prefs.getBoolPref('browser.tabs.newTabFocus')) {
        queueMicrotask(() => setCurrentTab(tab))
      }
    },
  },
]

interface MenuItemBase {}

export interface MenuItemSeparator extends MenuItemBase {
  type: 'separator'
}

type VisibilityCheck = (info: ContextMenuInfo) => boolean
export interface MenuItemAction extends MenuItemBase {
  type: 'action'
  id: (typeof MENU_ITEM_ACTION_IDS)[number]
  title: string
  icon?: string

  visible: VisibilityCheck
  action: (info: ContextMenuInfo) => void
}

export type MenuItem = MenuItemSeparator | MenuItemAction

export function fromId(id: string): MenuItem {
  if (id == 'separator') return { type: 'separator' } as const
  return MENU_ITEM_ACTIONS.find((item) => item.id == id)!
}

export const toIdString = (items: MenuItem[]): string =>
  items
    .map((item) => (item.type === 'separator' ? 'separator' : item.id))
    .join(',')

export const fromIdString = (idString: string): MenuItem[] =>
  idString.split(',').map(fromId).filter(Boolean)

export const getFromPref = (pref: string): MenuItem[] =>
  fromIdString(Services.prefs.getStringPref(pref, ''))

export function getMenuItemsDynamicPref(pref: string): Readable<MenuItem[]> {
  return readable(getFromPref(pref), (set) => {
    const observer = observable(() => set(getFromPref(pref)))
    Services.prefs.addObserver(pref, observer)
    return () => Services.prefs.removeObserver(pref, observer)
  })
}

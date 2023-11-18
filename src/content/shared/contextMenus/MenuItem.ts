/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { type Readable, readable } from 'svelte/store'

import type { ContextMenuInfo } from '../../../actors/ContextMenu.types'
import { observable } from '../../browser/lib/xul/observable'
import { MENU_ITEM_ACTIONS } from './menuItems'

/**
 * All of the valid menu item IDs. Note that it must not include 'separator'
 */
export const MENU_ITEM_ACTION_IDS = [
  'selection__copy',
  'link__copy',
  'link__new-tab',
  'navigation__back',
  'navigation__forward',
  'navigation__reload',
  'navigation__bookmark',
  'image__copy-link',
  'image__new-tab',
  'image__save',
] as const

interface MenuItemBase {}

export interface MenuItemSeparator extends MenuItemBase {
  type: 'separator'
}

export type VisibilityCheck = (info: ContextMenuInfo) => boolean
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

/**
 * All of the valid menu item IDs. Note that it must not include 'separator'
 */
export const MENU_ITEM_ACTION_IDS = [
  'selection__copy',
  'link__copy',
  'link__new-tab',
] as const

export const MENU_ITEM_ACTIONS: MenuItemAction[] = [
  {
    type: 'action',
    id: 'selection__copy',
    title: 'Copy',
  },
  {
    type: 'action',
    id: 'link__copy',
    title: 'Copy Link',
  },
  {
    type: 'action',
    id: 'link__new-tab',
    title: 'Open Link in New Tab',
  },
]

interface MenuItemBase {}

export interface MenuItemSeparator extends MenuItemBase {
  type: 'separator'
}

export interface MenuItemAction extends MenuItemBase {
  type: 'action'
  id: (typeof MENU_ITEM_ACTION_IDS)[number]
  title: string
  icon?: string
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

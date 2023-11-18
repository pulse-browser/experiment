import curry from 'fnts/curry'

import type { MenuItemAction, VisibilityCheck } from '.'
import type { ContextMenuInfo } from '../../../actors/ContextMenu.types'
import {
  contextMenuParentActor,
  openTab,
  runOnCurrentTab,
  setCurrentTab,
} from '../../browser/lib/globalApi'
import { resource } from '../../browser/lib/resources'
import { getClipboardHelper } from '../../browser/lib/xul/ccWrapper'

const ALWAYS = () => true
const HAS_TEXT_SELECTION: VisibilityCheck = (info) =>
  typeof info.textSelection == 'string'
const HAS_HREF: VisibilityCheck = (info) => typeof info.href == 'string'
const HAS_IMAGE_SRC: VisibilityCheck = (info) =>
  typeof info.imageSrc == 'string'

const onStringValue = curry(
  (
    method: (value: string, info: ContextMenuInfo) => void,
    prop: keyof ContextMenuInfo,
    info: ContextMenuInfo,
  ) => {
    const value = info[prop]
    if (typeof value == 'string') method(value, info)
  },
)

const copyProp = onStringValue((value) => {
  const clipboardHelper = getClipboardHelper()
  clipboardHelper.copyString(value, 0)
})

const openInNewTab = onStringValue((value) => {
  const tab = openTab(resource.NetUtil.newURI(value))
  if (Services.prefs.getBoolPref('browser.tabs.newTabFocus')) {
    queueMicrotask(() => setCurrentTab(tab))
  }
})

const saveImageUrl = onStringValue((value, info) => {
  if (!info.context.principal)
    throw new Error('Expected context menu info to have a principal')
  urlSecurityCheck(value, info.context.principal)
  const wgp = contextMenuParentActor.manager

  internalSave(
    value,
    null,
    null,
    null,
    info.mediaInfo?.contentType || null,
    info.mediaInfo?.contentDisposition || null,
    false,
    'SaveImageTitle',
    null,
    resource.E10SUtils.deserializeReferrerInfo(info.context.referrerInfo) ||
      null,
    wgp?.cookieJarSettings,
    null,
    false,
    null,
    false,
    info.context.principal,
  )
})

export const MENU_ITEM_ACTIONS: MenuItemAction[] = (
  [
    {
      id: 'selection__copy',
      title: 'Copy',

      visible: HAS_TEXT_SELECTION,
      action: copyProp('textSelection'),
    },
    {
      id: 'link__copy',
      title: 'Copy Link',

      visible: HAS_HREF,
      action: copyProp('textSelection'),
    },
    {
      id: 'link__new-tab',
      title: 'Open Link in New Tab',

      visible: HAS_HREF,
      action: openInNewTab('href'),
    },
    {
      id: 'navigation__back',
      title: 'Back',

      visible: ALWAYS,
      action: () => runOnCurrentTab((tab) => tab.goBack()),
    },
    {
      id: 'navigation__forward',
      title: 'Forward',

      visible: ALWAYS,
      action: () => runOnCurrentTab((tab) => tab.goForward()),
    },
    {
      id: 'navigation__reload',
      title: 'Reload',

      visible: ALWAYS,
      action: () => runOnCurrentTab((tab) => tab.reload()),
    },
    {
      id: 'navigation__bookmark',
      title: 'Bookmark This Page',

      visible: ALWAYS,
      action: () => window.windowApi.windowTriggers.emit('bookmarkCurrentPage'),
    },
    {
      id: 'image__copy',
      title: 'Copy Image',

      visible: HAS_IMAGE_SRC,
      action: () => goDoCommand('cmd_copyImage'),
    },
    {
      id: 'image__copy-link',
      title: 'Copy Image Link',

      visible: HAS_IMAGE_SRC,
      action: copyProp('imageSrc'),
    },
    {
      id: 'image__new-tab',
      title: 'Open Image in New Tab',

      visible: HAS_IMAGE_SRC,
      action: openInNewTab('imageSrc'),
    },
    {
      id: 'image__save',
      title: 'Save Image As...',

      visible: HAS_IMAGE_SRC,
      action: saveImageUrl('imageSrc'),
    },
  ] as const
).map((item) => ({ ...item, type: 'action' }) satisfies MenuItemAction)

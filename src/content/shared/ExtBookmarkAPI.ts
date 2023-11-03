/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * A helper for interacting with bookmarks with a similar target API to the webextention
 * api
 */

import { lazyESModuleGetters } from './TypedImportUtilities'

const lazy = lazyESModuleGetters({
  PlacesUtils: 'resource://gre/modules/PlacesUtils.sys.mjs',
  Bookmarks: 'resource://gre/modules/Bookmarks.sys.mjs',
})

const { TYPE_BOOKMARK, TYPE_FOLDER, TYPE_SEPARATOR } = lazy.Bookmarks

const BOOKMARK_SEPERATOR_URL = 'data:' as const
const BOOKMARKS_TYPES_TO_API_TYPES_MAP = new Map<any, BookmarkType>([
  [TYPE_BOOKMARK, 'bookmark'],
  [TYPE_FOLDER, 'folder'],
  [TYPE_SEPARATOR, 'separator'],
])

const API_TYPES_TO_BOOKMARKS_TYPES_MAP = new Map(
  [...BOOKMARKS_TYPES_TO_API_TYPES_MAP.entries()].map(([k, v]) => [v, k]),
)

export type BookmarkType = 'bookmark' | 'folder' | 'separator'

interface TreeNodeBase {
  id: string

  title: string
  index: number
  dateAdded: number
}

export interface BookmarkTreeNode extends TreeNodeBase {
  type: 'bookmark'
  parentId: string
  url: string
}

export interface FolderTreeNode extends TreeNodeBase {
  type: 'folder'
  parentId?: string
  children?: TreeNode[]
  dateGroupModified: number
}

export interface SeparatorTreeNode extends TreeNodeBase {
  type: 'separator'
  parentId: string
  url: typeof BOOKMARK_SEPERATOR_URL
}

export type TreeNode = BookmarkTreeNode | FolderTreeNode | SeparatorTreeNode

function getUrl(type: any, url: string): string | undefined {
  switch (type) {
    case TYPE_BOOKMARK:
      return url
    case TYPE_SEPARATOR:
      return BOOKMARK_SEPERATOR_URL
    default:
      return undefined
  }
}

export async function getTree(
  rootGuid: string,
  onlyChildren: boolean,
): Promise<TreeNode[]> {
  const convert =
    (parent: any) =>
    (node: any): TreeNode => {
      const bookmark = convertBookmarks(node)

      if (parent) bookmark.parentId = parent.guid
      if (bookmark.type === 'folder' && !onlyChildren)
        bookmark.children = node.children?.map(convert(node)) || []

      return bookmark
    }

  const root = await lazy.PlacesUtils.promiseBookmarksTree(rootGuid, undefined)

  if (onlyChildren) {
    const children = root.children || []
    return children.map(convert(root))
  }

  const treenode = convert(null)(root)
  treenode.parentId = root.parentGuid
  return [treenode]
}

const convertBookmarks = (result: any): TreeNode => {
  const type = BOOKMARKS_TYPES_TO_API_TYPES_MAP.get(
    result.typeCode || result.type,
  )
  const treeNode: TreeNodeBase = {
    id: result.guid,
    title: lazy.Bookmarks.getLocalizedTitle(result) || '',
    index: result.index,
    dateAdded: result.dateAdded / 1000,
  }

  if (!type) {
    throw new Error('Invalid bookmark type')
  }

  if (type == 'bookmark') {
    const bookmark: BookmarkTreeNode = {
      ...treeNode,
      type: 'bookmark',
      parentId: result.parentGuid as string,
      url: result.url ? result.url.href : result.uri,
    }
    return bookmark
  }

  if (type == 'folder') {
    const folder: FolderTreeNode = {
      ...treeNode,
      type: 'folder',
      parentId: result.parentGuid,
      dateGroupModified: result.lastModified / 1000,
    }
    return folder
  }

  const separator: SeparatorTreeNode = {
    ...treeNode,
    type: 'separator',
    parentId: result.parentGuid,
    url: 'data:',
  }
  return separator
}

export async function getChildren(rootGuid: string): Promise<TreeNode[]> {
  const [treenode] = await getTree(rootGuid, false)
  return (treenode as FolderTreeNode).children || []
}

export const getFullTree = () => getChildren(lazy.Bookmarks.rootGuid)

export const search = (
  query: string | Partial<{ query: string; url: string; title: string }>,
) =>
  (lazy.Bookmarks.search(query) as Promise<any[]>).then((results) =>
    results.map(convertBookmarks),
  )

export interface CreateDetails {
  index: number
  parentId: string
  title: string
  type: BookmarkType
  url: string
}

export const ensureNotRoot = (id: string): string => {
  if (id === lazy.Bookmarks.rootGuid)
    throw new Error('The root bookmark cannot be modified')

  return id
}

export function create(options: Partial<CreateDetails>): Promise<TreeNode> {
  const info: Record<string, any> = {
    title: options.title,
    index: options.index,
    parentGuid: options.parentId
      ? ensureNotRoot(options.parentId)
      : lazy.Bookmarks.unfiledGuid,
    type: options.type
      ? API_TYPES_TO_BOOKMARKS_TYPES_MAP.get(options.type)
      : options.url
      ? TYPE_BOOKMARK
      : TYPE_FOLDER,
  }

  if (info.type === TYPE_BOOKMARK) info.url = options.url

  return lazy.Bookmarks.insert(info).then(convertBookmarks)
}

export function get(id: string): Promise<TreeNode> {
  return lazy.Bookmarks.fetch(id).then(convertBookmarks)
}

export const update = (
  id: string,
  changes: Partial<{ title: string; url: string }>,
): Promise<TreeNode> =>
  lazy.Bookmarks.update({
    guid: ensureNotRoot(id),
    title: changes.title,
    url: changes.url,
  }).then(convertBookmarks)

export const remove = (
  id: string,
  removeNonEmptyFolders = false,
): Promise<void> =>
  lazy.Bookmarks.remove(
    { guid: ensureNotRoot(id) },
    { preventRemovalOfNonEmptyFolders: !removeNonEmptyFolders },
  )

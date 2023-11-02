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
  const type = BOOKMARKS_TYPES_TO_API_TYPES_MAP.get(result.typeCode)
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
      url: result.uri as string,
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

/**
 * For some reason, multiple lazy imports inside of the same webpack output are
 * causing issues. You should make sure that all lazy imports are placed within
 * this file to reduce the number of issues
 */
import { lazyESModuleGetters } from './TypedImportUtilities'

export const lazy = lazyESModuleGetters({
  PlacesUtils: 'resource://gre/modules/PlacesUtils.sys.mjs',
  Bookmarks: 'resource://gre/modules/Bookmarks.sys.mjs',
  History: 'resource://gre/modules/History.sys.mjs',
})

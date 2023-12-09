/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/// <reference types="gecko-types" />

declare module 'resource://app/modules/FaviconLoader.sys.mjs' {
  export const FaviconLoader: typeof import('./modules/FaviconLoader').FaviconLoader
}

declare module 'resource://app/modules/TypedImportUtils.sys.mjs' {
  export const lazyESModuleGetters: typeof import('./modules/TypedImportUtils').lazyESModuleGetters
}

declare interface MozESMExportFile {
  TypedImportUtils: 'resource://app/modules/TypedImportUtils.sys.mjs'
  WindowTracker: 'resource://app/modules/BrowserWindowTracker.sys.mjs'
}

declare interface MozESMExportType {
  TypedImportUtils: typeof import('./modules/TypedImportUtils')
  WindowTracker: typeof import('./modules/BrowserWindowTracker').WindowTracker
}

declare let Cr: Record<string, nsresult>

declare interface Document {
  documentURIObject: nsIURIType
}

declare interface Node {
  nodePrincipal: nsIPrincipalType
  ownerGlobal: Window
  documentLoadGroup: nsIRequestType
}

declare interface LoadURIOptions {
  triggeringPrincipal?: Principal
  csp?: ContentSecurityPolicy
  loadFlags?: number
  referrerInfo?: ReferrerInfo
  postData?: nsIInputStreamType
  headers?: nsIInputStreamType
  baseURI?: nsIURIType
  hasValidUserGestureActivation?: boolean
  triggeringSandboxFlags?: number
  triggeringWindowId?: number
  triggeringStorageAccess?: boolean
  triggeringRemoteType?: string
  cancelContentJSEpoch?: number
  remoteTypeOverride?: string
  wasSchemelessInput?: string
}

declare interface XULBrowserElement extends HTMLElement {
  contentTitle: string
  source: string
  canGoBack: boolean
  goBack()
  canGoForward: boolean
  goForward()
  reload()
  loadURI(uri: nsIURIType, params?: LoadURIOptions)
  browserId: number
  mInitialized: boolean
  webProgress: nsIWebProgressType

  swapDocShells(aOtherBrowser: XULBrowserElement)
}

declare interface XULFindBarElement extends HTMLElement {
  browser: XULBrowserElement
  open()
  close()
}

declare interface XULPanel extends HTMLElement {
  openPopup(target: HTMLElement, anchor: string)
}

declare interface XULMenuPopup extends HTMLElement {
  openPopupAtScreen(
    x?: number,
    y?: number,
    isContextMenu?: boolean,
    trigger?: Event,
  )
}

declare interface PlacesBookmarkTreeNode {
  guid: string
  /** @deprecated */
  id: number
  type?: number
  typeCode?: number
  title: string
  dateAdded: number
  lastModified: number
  index: number

  parentGuid?: string
  itemsCount?: number

  uri?: string
  url?: URL
  tags?: string
  charset?: string
  keyword?: string
  postData?: string
  iconUri?: string

  children?: BookmarkTreeNode[]
}

/**
 * The definition of Deferred object which is returned by PromiseUtils.defer(),
 * It contains a Promise and methods to resolve/reject it.
 */
declare interface GenericDeferred<T, E = unknown> {
  /* A method to resolve the associated Promise with the value passed.
   * If the promise is already settled it does nothing.
   *
   * @param value  This value is used to resolve the promise
   * If the value is a Promise then the associated promise assumes the state
   * of Promise passed as value.
   */
  resolve: (val: T) => void

  /* A method to reject the assocaited Promise with the value passed.
   * If the promise is already settled it does nothing.
   *
   * @param reason The reason for the rejection of the Promise.
   * Generally its an Error object. If however a Promise is passed, then the Promise
   * itself will be the reason for rejection no matter the state of the Promise.
   */
  reject: (err: E) => void

  /* A newly created Pomise object.
   * Initially in pending state.
   */
  promise: Promise<T>
}

// Typescript generates really broken types for this module by default
declare module 'resource://gre/modules/PlacesUtils.sys.mjs' {
  export namespace PlacesUtils {
    let history: nsINavHistoryServiceType

    let TYPE_X_MOZ_PLACE_CONTAINER: string
    let TYPE_X_MOZ_PLACE_SEPARATOR: string
    let TYPE_X_MOZ_PLACE: string
    let TYPE_X_MOZ_URL: string
    let TYPE_HTML: string
    let TYPE_PLAINTEXT: string
    let TYPE_X_MOZ_PLACE_ACTION: string
    let LMANNO_FEEDURI: string
    let LMANNO_SITEURI: string
    let CHARSET_ANNO: string
    let MOBILE_ROOT_ANNO: string
    let TOPIC_SHUTDOWN: string
    let TOPIC_INIT_COMPLETE: string
    let TOPIC_DATABASE_LOCKED: string
    let TOPIC_EXPIRATION_FINISHED: string
    let TOPIC_FAVICONS_EXPIRED: string
    let TOPIC_VACUUM_STARTING: string
    let TOPIC_BOOKMARKS_RESTORE_BEGIN: string
    let TOPIC_BOOKMARKS_RESTORE_SUCCESS: string
    let TOPIC_BOOKMARKS_RESTORE_FAILED: string
    let observers: any
    let virtualAllBookmarksGuid: string
    let virtualHistoryGuid: string
    let virtualDownloadsGuid: string
    let virtualTagsGuid: string
    /**
     * Checks if a guid is a virtual left-pane root.
     *
     * @param {String} guid The guid of the item to look for.
     * @returns {Boolean} true if guid is a virtual root, false otherwise.
     */
    function isVirtualLeftPaneItem(guid: string): boolean
    function asContainer(aNode: any): any
    function asQuery(aNode: any): any
    let endl: any
    /**
     * Is a string a valid GUID?
     *
     * @param guid: (String)
     * @return (Boolean)
     */
    function isValidGuid(guid: any): boolean
    /**
     * Is a string a valid GUID prefix?
     *
     * @param guidPrefix: (String)
     * @return (Boolean)
     */
    function isValidGuidPrefix(guidPrefix: any): boolean
    /**
     * Generates a random GUID and replace its beginning with the given
     * prefix. We do this instead of just prepending the prefix to keep
     * the correct character length.
     *
     * @param prefix: (String)
     * @return (String)
     */
    function generateGuidWithPrefix(prefix: any): any
    /**
     * Converts a string or n URL object to an nsIURI.
     *
     * @param url (URL) or (String)
     *        the URL to convert.
     * @return nsIURI for the given URL.
     */
    function toURI(url: any): any
    /**
     * Convert a Date object to a PRTime (microseconds).
     *
     * @param date
     *        the Date object to convert.
     * @return microseconds from the epoch.
     */
    function toPRTime(date: any): number
    /**
     * Convert a PRTime to a Date object.
     *
     * @param time
     *        microseconds from the epoch.
     * @return a Date object.
     */
    function toDate(time: any): Date
    function toISupportsString(aString: any): any
    function getFormattedString(key: any, params: any): any
    function getString(key: any): any
    /**
     * Parses a moz-action URL and returns its parts.
     *
     * @param url A moz-action URI.
     * @note URL is in the format moz-action:ACTION,JSON_ENCODED_PARAMS
     */
    function parseActionUrl(url: any): {
      type: any
      params: any
    }
    /**
     * Determines if a folder is generated from a query.
     * @param aNode a result true.
     * @returns true if the node is a folder generated from a query.
     */
    function isQueryGeneratedFolder(node: any): boolean
    function nodeIsFolder(aNode: any): boolean
    function nodeIsBookmark(aNode: any): any
    function nodeIsSeparator(aNode: any): boolean
    function nodeIsURI(aNode: any): boolean
    function nodeIsQuery(aNode: any): boolean
    function nodeAncestors(aNode: any): Generator<any, void, unknown>
    /**
     * Checks validity of an object, filling up default values for optional
     * properties.
     *
     * @param {string} name
     *        The operation name. This is included in the error message if
     *        validation fails.
     * @param validators (object)
     *        An object containing input validators. Keys should be field names;
     *        values should be validation functions.
     * @param props (object)
     *        The object to validate.
     * @param behavior (object) [optional]
     *        Object defining special behavior for some of the properties.
     *        The following behaviors may be optionally set:
     *         - required: this property is required.
     *         - replaceWith: this property will be overwritten with the value
     *                        provided
     *         - requiredIf: if the provided condition is satisfied, then this
     *                       property is required.
     *         - validIf: if the provided condition is not satisfied, then this
     *                    property is invalid.
     *         - defaultValue: an undefined property should default to this value.
     *         - fixup: a function invoked when validation fails, takes the input
     *                  object as argument and must fix the property.
     *
     * @return a validated and normalized item.
     * @throws if the object contains invalid data.
     * @note any unknown properties are pass-through.
     */
    function validateItemProperties(
      name: string,
      validators: any,
      props: any,
      behavior?: {},
    ): {}
    let BOOKMARK_VALIDATORS: any
    let PAGEINFO_VALIDATORS: any
    let SYNC_BOOKMARK_VALIDATORS: any
    let SYNC_CHANGE_RECORD_VALIDATORS: any
    let QueryInterface: any
    let _shutdownFunctions: any[]
    function registerShutdownFunction(aFunc: any): void
    function observe(aSubject: any, aTopic: any, aData: any): void
    function nodeIsHost(aNode: any): boolean
    function nodeIsDay(aNode: any): boolean
    function nodeIsTagQuery(aNode: any): boolean
    let containerTypes: any[]
    function nodeIsContainer(aNode: any): boolean
    function nodeIsHistoryContainer(aNode: any): boolean
    /**
     * Gets the concrete item-guid for the given node. For everything but folder
     * shortcuts, this is just node.bookmarkGuid.  For folder shortcuts, this is
     * node.targetFolderGuid (see nsINavHistoryService.idl for the semantics).
     *
     * @param aNode
     *        a result node.
     * @return the concrete item-guid for aNode.
     */
    function getConcreteItemGuid(aNode: any): any
    /**
     * Reverse a host based on the moz_places algorithm, that is reverse the host
     * string and add a trailing period.  For example "google.com" becomes
     * "moc.elgoog.".
     *
     * @param url
     *        the URL to generate a rev host for.
     * @return the reversed host string.
     */
    function getReversedHost(url: any): string
    /**
     * String-wraps a result node according to the rules of the specified
     * content type for copy or move operations.
     *
     * @param   aNode
     *          The Result node to wrap (serialize)
     * @param   aType
     *          The content type to serialize as
     * @return  A string serialization of the node
     */
    function wrapNode(aNode: any, aType: any): any
    function unwrapNodes(blob: any, type: any): any
    /**
     * Validate an input PageInfo object, returning a valid PageInfo object.
     *
     * @param pageInfo: (PageInfo)
     * @return (PageInfo)
     */
    function validatePageInfo(pageInfo: any, validateVisits?: boolean): {}
    /**
     * Normalize a key to either a string (if it is a valid GUID) or an
     * instance of `URL` (if it is a `URL`, `nsIURI`, or a string
     * representing a valid url).
     *
     * @throws (TypeError)
     *         If the key is neither a valid guid nor a valid url.
     */
    function normalizeToURLOrGUID(key: any): any
    /**
     * Generates a nsINavHistoryResult for the contents of a folder.
     * @param   aFolderGuid
     *          The folder to open
     * @param   [optional] excludeItems
     *          True to hide all items (individual bookmarks). This is used on
     *          the left places pane so you just get a folder hierarchy.
     * @param   [optional] expandQueries
     *          True to make query items expand as new containers. For managing,
     *          you want this to be false, for menus and such, you want this to
     *          be true.
     * @returns A nsINavHistoryResult containing the contents of the
     *          folder. The result.root is guaranteed to be open.
     */
    function getFolderContents(
      aFolderGuid: any,
      aExcludeItems: any,
      aExpandQueries: any,
    ): any
    const tagsFolderId: any
    /**
     * Checks if item is a root.
     *
     * @param {String} guid The guid of the item to look for.
     * @returns {Boolean} true if guid is a root, false otherwise.
     */
    function isRootItem(guid: string): boolean
    function getContainerNodeWithOptions(
      aNode: any,
      aExcludeItems: any,
      aExpandQueries: any,
    ): any
    function hasChildURIs(aNode: any): boolean
    function getURLsForContainerNode(aNode: any): any[]
    function promiseDBConnection(): any
    function promiseLargeCacheDBConnection(): any
    const largeCacheDBConnDeferred: any
    function promiseUnsafeWritableDBConnection(): any
    /**
     * Performs a read/write operation on the Places database through a Sqlite.sys.mjs
     * wrapped connection to the Places database.
     *
     * This is intended to be used only by Places itself, always use APIs if you
     * need to modify the Places database. Use promiseDBConnection if you need to
     * SELECT from the database and there's no covering API.
     * Keep in mind the Places DB schema is by no means frozen or even stable.
     * Your custom queries can - and will - break overtime.
     *
     * As all operations on the Places database are asynchronous, if shutdown
     * is initiated while an operation is pending, this could cause dataloss.
     * Using `withConnectionWrapper` ensures that shutdown waits until all
     * operations are complete before proceeding.
     *
     * Example:
     * await withConnectionWrapper("Bookmarks: Remove a bookmark", Task.async(function*(db) {
     *    // Proceed with the db, asynchronously.
     *    // Shutdown will not interrupt operations that take place here.
     * }));
     *
     * @param {string} name The name of the operation. Used for debugging, logging
     *   and crash reporting.
     * @param {function(db)} task A function that takes as argument a Sqlite.sys.mjs
     *   connection and returns a Promise. Shutdown is guaranteed to not interrupt
     *   execution of `task`.
     */
    function withConnectionWrapper(
      name: string,
      task: (arg0: any) => any,
    ): Promise<any>
    /**
     * Gets favicon data for a given page url.
     *
     * @param {string | URL | nsIURI} aPageUrl
     *   url of the page to look favicon for.
     * @param {number} preferredWidth
     *   The preferred width of the favicon in pixels. The default value of 0
     *   returns the largest icon available.
     * @resolves to an object representing a favicon entry, having the following
     *           properties: { uri, dataLen, data, mimeType }
     * @rejects JavaScript exception if the given url has no associated favicon.
     */
    function promiseFaviconData(
      aPageUrl: any,
      preferredWidth?: number,
    ): Promise<any>
    /**
     * Returns the passed URL with a #size ref for the specified size and
     * devicePixelRatio.
     *
     * @param window
     *        The window where the icon will appear.
     * @param href
     *        The string href we should add the ref to.
     * @param size
     *        The target image size
     * @return The URL with the fragment at the end, in the same formar as input.
     */
    function urlWithSizeRef(window: any, href: any, size: any): string
    /**
     * Asynchronously retrieve a JS-object representation of a places bookmarks
     * item (a bookmark, a folder, or a separator) along with all of its
     * descendants.
     *
     * @param [optional] aItemGuid
     *        the (topmost) item to be queried.  If it's not passed, the places
     *        root is queried: that is, you get a representation of the entire
     *        bookmarks hierarchy.
     * @param [optional] aOptions
     *        Options for customizing the query behavior, in the form of a JS
     *        object with any of the following properties:
     *         - excludeItemsCallback: a function for excluding items, along with
     *           their descendants.  Given an item object (that has everything set
     *           apart its potential children data), it should return true if the
     *           item should be excluded.  Once an item is excluded, the function
     *           isn't called for any of its descendants.  This isn't called for
     *           the root item.
     *           WARNING: since the function may be called for each item, using
     *           this option can slow down the process significantly if the
     *           callback does anything that's not relatively trivial.  It is
     *           highly recommended to avoid any synchronous I/O or DB queries.
     *        - includeItemIds: opt-in to include the deprecated id property.
     *          Use it if you must. It'll be removed once the switch to GUIDs is
     *          complete.
     *
     * @return {Promise}
     * @resolves to a JS object that represents either a single item or a
     * bookmarks tree.  Each node in the tree has the following properties set:
     *  - guid (string): the item's GUID (same as aItemGuid for the top item).
     *  - [deprecated] id (number): the item's id. This is only if
     *    aOptions.includeItemIds is set.
     *  - type (string):  the item's type.  @see PlacesUtils.TYPE_X_*
     *  - typeCode (number):  the item's type in numeric format.
     *    @see PlacesUtils.bookmarks.TYPE_*
     *  - title (string): the item's title. If it has no title, this property
     *    isn't set.
     *  - dateAdded (number, microseconds from the epoch): the date-added value of
     *    the item.
     *  - lastModified (number, microseconds from the epoch): the last-modified
     *    value of the item.
     *  - index: the item's index under it's parent.
     *
     * The root object (i.e. the one for aItemGuid) also has the following
     * properties set:
     *  - parentGuid (string): the GUID of the root's parent.  This isn't set if
     *    the root item is the places root.
     *  - itemsCount (number, not enumerable): the number of items, including the
     *    root item itself, which are represented in the resolved object.
     *
     * Bookmark items also have the following properties:
     *  - uri (string): the item's url.
     *  - tags (string): csv string of the bookmark's tags.
     *  - charset (string): the last known charset of the bookmark.
     *  - keyword (string): the bookmark's keyword (unset if none).
     *  - postData (string): the bookmark's keyword postData (unset if none).
     *  - iconUri (string): the bookmark's favicon url.
     * The last four properties are not set at all if they're irrelevant (e.g.
     * |charset| is not set if no charset was previously set for the bookmark
     * url).
     *
     * Folders may also have the following properties:
     *  - children (array): the folder's children information, each of them
     *    having the same set of properties as above.
     *
     * @rejects if the query failed for any reason.
     * @note if aItemGuid points to a non-existent item, the returned promise is
     * resolved to null.
     */
    function promiseBookmarksTree(
      aItemGuid?: string,
      aOptions?: {},
    ): Promise<any>
    /**
     * Returns a generator that iterates over `array` and yields slices of no
     * more than `chunkLength` elements at a time.
     *
     * @param  {Array} array An array containing zero or more elements.
     * @param  {number} chunkLength The maximum number of elements in each chunk.
     * @yields {Array} A chunk of the array.
     * @throws if `chunkLength` is negative or not an integer.
     */
    function chunkArray(
      array: any[],
      chunkLength: number,
    ): Generator<any[], void, unknown>
    /**
     * Returns SQL placeholders to bind multiple values into an IN clause.
     * @param {Array|number} info
     *   Array or number of entries to create.
     * @param {string} [prefix]
     *   String prefix to add before the SQL param.
     * @param {string} [suffix]
     *   String suffix to add after the SQL param.
     */
    function sqlBindPlaceholders(
      info: number | any[],
      prefix?: string,
      suffix?: string,
    ): string
    /**
     * Run some text through md5 and return the hash.
     * @param {string} data The string to hash.
     * @param {string} [format] Which format of the hash to return:
     *   - "ascii" for ascii format.
     *   - "hex" for hex format.
     * @returns {string} md5 hash of the input string in the required format.
     */
    function md5(data: string, { format }?: string): string
    /**
     * Inserts a new place if one doesn't currently exist.
     *
     * This should only be used from an API that is connecting this new entry to
     * some additional foreign table. Otherwise this will just create an orphan
     * entry that could be expired at any time.
     *
     * @param db
     *        The database connection to use.
     * @param url
     *        A valid URL object.
     * @return {Promise} resolved when the operation is complete.
     */
    function maybeInsertPlace(db: any, url: any): Promise<any>
    /**
     * Tries to insert a set of new places if they don't exist yet.
     *
     * This should only be used from an API that is connecting this new entry to
     * some additional foreign table. Otherwise this will just create an orphan
     * entry that could be expired at any time.
     *
     * @param db
     *        The database to use
     * @param urls
     *        An array with all the url objects to insert.
     * @return {Promise} resolved when the operation is complete.
     */
    function maybeInsertManyPlaces(db: any, urls: any): Promise<any>
    const isInAutomation: any
    /**
     * Creates a logger.
     * Logging level can be controlled through places.loglevel.
     *
     * @param {string} [prefix] Prefix to use for the logged messages, "::" will
     *                 be appended automatically to the prefix.
     * @returns {object} The logger.
     */
    function getLogger({ prefix }?: string): object
  }
}

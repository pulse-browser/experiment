/* eslint-disable @typescript-eslint/ban-types */
/// <reference types="gecko-types" />
import { ConduitAddress } from 'resource://gre/modules/ConduitsParent.sys.mjs'
import { Extension } from 'resource://gre/modules/Extension.sys.mjs'
import { SchemaRoot } from 'resource://gre/modules/Schemas.sys.mjs'

import { PointConduit } from './ConduitChild'

declare global {
  type SavedFrame = unknown

  /* eslint-disable @typescript-eslint/no-explicit-any */
  function getConsole(): any
  function runSafeSyncWithoutClone(f: any, ...args: any[]): any
  function instanceOf(value: any, type: any): boolean
  /**
   * Convert any of several different representations of a date/time to a Date object.
   * Accepts several formats:
   * a Date object, an ISO8601 string, or a number of milliseconds since the epoch as
   * either a number or a string.
   *
   * @param {Date|string|number} date
   *      The date to convert.
   * @returns {Date}
   *      A Date object
   */
  function normalizeTime(date: Date | string | number): Date
  function withHandlingUserInput(window: any, callable: any): any
  /**
   * Defines a lazy getter for the given property on the given object. The
   * first time the property is accessed, the return value of the getter
   * is defined on the current `this` object with the given property name.
   * Importantly, this means that a lazy getter defined on an object
   * prototype will be invoked separately for each object instance that
   * it's accessed on.
   *
   * @param {object} object
   *        The prototype object on which to define the getter.
   * @param {string | symbol} prop
   *        The property name for which to define the getter.
   * @param {Function} getter
   *        The function to call in order to generate the final property
   *        value.
   */
  function defineLazyGetter(
    object: object,
    prop: string | symbol,
    getter: Function,
  ): void
  function checkLoadURI(uri: any, principal: any, options: any): boolean
  function checkLoadURL(url: any, principal: any, options: any): boolean
  function makeWidgetId(id: any): any
  function LocaleData(data: any): void
  class LocaleData {
    constructor(data: any)
    defaultLocale: any
    selectedLocale: any
    locales: any
    warnedMissingKeys: Set<any>
    messages: any
    serialize(): {
      defaultLocale: any
      selectedLocale: any
      messages: any
      locales: any
    }
    BUILTIN: string
    has(locale: any): any
    localizeMessage(message: any, substitutions?: any[], options?: {}): any
    localize(str: any, locale?: any): any
    addLocale(locale: any, messages: any, extension: any): Map<any, any>
    get acceptLanguages(): any
    get uiLocale(): any
  }
  const ExtensionCommon: any
  /**
   * A sentinel class to indicate that an array of values should be
   * treated as an array when used as a promise resolution value, but as a
   * spread expression (...args) when passed to a callback.
   */
  class SpreadArgs extends Array<any> {
    constructor(args: any)
  }
  /**
   * Like SpreadArgs, but also indicates that the array values already
   * belong to the target compartment, and should not be cloned before
   * being passed.
   *
   * The `unwrappedValues` property contains an Array object which belongs
   * to the target compartment, and contains the same unwrapped values
   * passed the NoCloneSpreadArgs constructor.
   */
  class NoCloneSpreadArgs {
    constructor(args: any)
    unwrappedValues: any;
    [Symbol.iterator](): any
  }
  class EventEmitter {
    /**
     * Checks whether there is some listener for the given event.
     *
     * @param {string} event
     *       The name of the event to listen for.
     * @returns {boolean}
     */
    has(event: string): boolean
    /**
     * Adds the given function as a listener for the given event.
     *
     * The listener function may optionally return a Promise which
     * resolves when it has completed all operations which event
     * dispatchers may need to block on.
     *
     * @param {string} event
     *       The name of the event to listen for.
     * @param {function(string, ...any)} listener
     *        The listener to call when events are emitted.
     */
    on(event: string, listener: (arg0: string, ...args: any[]) => any): void
    /**
     * Removes the given function as a listener for the given event.
     *
     * @param {string} event
     *       The name of the event to stop listening for.
     * @param {function(string, ...any)} listener
     *        The listener function to remove.
     */
    off(event: string, listener: (arg0: string, ...args: any[]) => any): void
    /**
     * Adds the given function as a listener for the given event once.
     *
     * @param {string} event
     *       The name of the event to listen for.
     * @param {function(string, ...any)} listener
     *        The listener to call when events are emitted.
     */
    once(event: string, listener: (arg0: string, ...args: any[]) => any): void
    /**
     * Triggers all listeners for the given event. If any listeners return
     * a value, returns a promise which resolves when all returned
     * promises have resolved. Otherwise, returns undefined.
     *
     * @param {string} event
     *       The name of the event to emit.
     * @param {any} args
     *        Arbitrary arguments to pass to the listener functions, after
     *        the event name.
     * @returns {Promise?}
     */
    emit(event: string, ...args: any): Promise<any> | null
    [LISTENERS]: Map<any, any>;
    [ONCE_MAP]: WeakMap<object, any>
  }
  /**
   * Base class for WebExtension APIs.  Each API creates a new class
   * that inherits from this class, the derived class is instantiated
   * once for each extension that uses the API.
   */
  class ExtensionAPI extends EventEmitter {
    constructor(extension: any)
    extension: any
    destroy(): void
    onManifestEntry(entry: any): void
    getAPI(context: any): void
  }
  /**
   * Subclass to add APIs commonly used with persistent events.
   * If a namespace uses events, it should use this subclass.
   *
   * this.apiNamespace = class extends ExtensionAPIPersistent {};
   */
  class ExtensionAPIPersistent extends ExtensionAPI {
    /**
     * Check for event entry.
     *
     * @param {string} event The event name e.g. onStateChanged
     * @returns {boolean}
     */
    hasEventRegistrar(event: string): boolean
    /**
     * Get the event registration fuction
     *
     * @param {string} event The event name e.g. onStateChanged
     * @returns {Function} register is used to start the listener
     *                     register returns an object containing
     *                     a convert and unregister function.
     */
    getEventRegistrar(event: string): Function
    /**
     * Used when instantiating an EventManager instance to register the listener.
     *
     * @param {object}      options         Options used for event registration
     * @param {BaseContext} options.context Extension Context passed when creating an EventManager instance.
     * @param {string}      options.event   The eAPI vent name.
     * @param {Function}    options.fire    The function passed to the listener to fire the event.
     * @param {Array<any>}  params          An optional array of parameters received along with the
     *                                      addListener request.
     * @returns {Function}                  The unregister function used in the EventManager.
     */
    registerEventListener(
      options: {
        context: BaseContext
        event: string
        fire: Function
      },
      params: Array<any>,
    ): Function
    /**
     * Used to prime a listener for when the background script is not running.
     *
     * @param {string} event The event name e.g. onStateChanged or captiveURL.onChange.
     * @param {Function} fire The function passed to the listener to fire the event.
     * @param {Array} params Params passed to the event listener.
     * @param {boolean} isInStartup unused here but passed for subclass use.
     * @returns {object} the unregister and convert functions used in the EventManager.
     */
    primeListener(
      event: string,
      fire: Function,
      params: any[],
      isInStartup: boolean,
    ): object
  }
  /**
   * This class contains the information we have about an individual
   * extension.  It is never instantiated directly, instead subclasses
   * for each type of process extend this class and add members that are
   * relevant for that process.
   *
   * @abstract
   */
  class BaseContext {
    constructor(envType: any, extension: any)
    envType: any
    onClose: Set<any>
    checkedLastError: boolean
    _lastError: any
    contextId: any
    unloaded: boolean
    extension: any
    manifestVersion: any
    jsonSandbox: any
    active: boolean
    incognito: any
    messageManager: any
    contentWindow: any
    innerWindowID: number
    cloneScopeError: any
    cloneScopePromise: any
    get isProxyContextParent(): boolean
    get Error(): any
    get Promise(): any
    get privateBrowsingAllowed(): any
    get isBackgroundContext(): boolean
    /**
     * Whether the extension context is using the WebIDL bindings for the
     * WebExtensions APIs.
     * To be overridden in subclasses (e.g. WorkerContextChild) and to be
     * optionally used in ExtensionAPI classes to customize the behavior of the
     * API when the calls to the extension API are originated from the WebIDL
     * bindings.
     */
    get useWebIDLBindings(): boolean
    canAccessWindow(window: any): any
    canAccessContainer(userContextId: any): any
    /**
     * Opens a conduit linked to this context, populating related address fields.
     * Only available in child contexts with an associated contentWindow.
     *
     * @param {object} subject
     * @param {ConduitAddress} address
     * @returns {PointConduit}
     */
    openConduit(subject: object, address: ConduitAddress): PointConduit
    setContentWindow(contentWindow: any): void
    logActivity(type: any, name: any, data: any): void
    get cloneScope(): void
    get principal(): void
    runSafe(callback: any, ...args: any[]): any
    runSafeWithoutClone(callback: any, ...args: any[]): any
    applySafe(callback: any, args: any, caller: any): any
    applySafeWithoutClone(callback: any, args: any, caller: any): any
    checkLoadURL(url: any, options?: {}): boolean
    /**
     * Safely call JSON.stringify() on an object that comes from an
     * extension.
     *
     * @param {Array<any>} args Arguments for JSON.stringify()
     * @returns {string} The stringified representation of obj
     */
    jsonStringify(...args: Array<any>): string
    callOnClose(obj: any): void
    forgetOnClose(obj: any): void
    set lastError(val: any)
    get lastError(): any
    /**
     * Normalizes the given error object for use by the target scope. If
     * the target is an error object which belongs to that scope, it is
     * returned as-is. If it is an ordinary object with a `message`
     * property, it is converted into an error belonging to the target
     * scope. If it is an Error object which does *not* belong to the
     * clone scope, it is reported, and converted to an unexpected
     * exception error.
     *
     * @param {Error|object} error
     * @param {SavedFrame?} [caller]
     * @returns {Error}
     */
    normalizeError(error: Error | object, caller?: SavedFrame): Error
    /**
     * Sets the value of `.lastError` to `error`, calls the given
     * callback, and reports an error if the value has not been checked
     * when the callback returns.
     *
     * @param {object} error An object with a `message` property. May
     *     optionally be an `Error` object belonging to the target scope.
     * @param {SavedFrame?} caller
     *        The optional caller frame which triggered this callback, to be used
     *        in error reporting.
     * @param {Function} callback The callback to call.
     * @returns {*} The return value of callback.
     */
    withLastError(error: object, caller: SavedFrame, callback: Function): any
    /**
     * Captures the most recent stack frame which belongs to the extension.
     *
     * @returns {SavedFrame?}
     */
    getCaller(): SavedFrame
    /**
     * Wraps the given promise so it can be safely returned to extension
     * code in this context.
     *
     * If `callback` is provided, however, it is used as a completion
     * function for the promise, and no promise is returned. In this case,
     * the callback is called when the promise resolves or rejects. In the
     * latter case, `lastError` is set to the rejection value, and the
     * callback function must check `browser.runtime.lastError` or
     * `extension.runtime.lastError` in order to prevent it being reported
     * to the console.
     *
     * @param {Promise} promise The promise with which to wrap the
     *     callback. May resolve to a `SpreadArgs` instance, in which case
     *     each element will be used as a separate argument.
     *
     *     Unless the promise object belongs to the cloneScope global, its
     *     resolution value is cloned into cloneScope prior to calling the
     *     `callback` function or resolving the wrapped promise.
     *
     * @param {Function} [callback] The callback function to wrap
     *
     * @returns {Promise|undefined} If callback is null, a promise object
     *     belonging to the target scope. Otherwise, undefined.
     */
    wrapPromise(
      promise: Promise<any>,
      callback?: Function,
    ): Promise<any> | undefined
    unload(): void
    /**
     * A simple proxy for unload(), for use with callOnClose().
     */
    close(): void
  }
  /**
   * An object that runs the implementation of a schema API. Instantiations of
   * this interfaces are used by Schemas.jsm.
   *
   * @interface
   */
  class SchemaAPIInterface {
    /**
     * Calls this as a function that returns its return value.
     *
     * @abstract
     * @param {Array} args The parameters for the function.
     * @returns {*} The return value of the invoked function.
     */
    callFunction(args: any[]): any
    /**
     * Calls this as a function and ignores its return value.
     *
     * @abstract
     * @param {Array} args The parameters for the function.
     */
    callFunctionNoReturn(args: any[]): void
    /**
     * Calls this as a function that completes asynchronously.
     *
     * @abstract
     * @param {Array} args The parameters for the function.
     * @param {function(*)} [callback] The callback to be called when the function
     *     completes.
     * @param {boolean} [requireUserInput=false] If true, the function should
     *                  fail if the browser is not currently handling user input.
     * @returns {Promise|undefined} Must be void if `callback` is set, and a
     *     promise otherwise. The promise is resolved when the function completes.
     */
    callAsyncFunction(
      args: any[],
      callback?: (arg0: any) => any,
      requireUserInput?: boolean,
    ): Promise<any> | undefined
    /**
     * Retrieves the value of this as a property.
     *
     * @abstract
     * @returns {*} The value of the property.
     */
    getProperty(): any
    /**
     * Assigns the value to this as property.
     *
     * @abstract
     * @param {string} value The new value of the property.
     */
    setProperty(value: string): void
    /**
     * Registers a `listener` to this as an event.
     *
     * @abstract
     * @param {Function} listener The callback to be called when the event fires.
     * @param {Array} args Extra parameters for EventManager.addListener.
     * @see EventManager.addListener
     */
    addListener(listener: Function, args: any[]): void
    /**
     * Checks whether `listener` is listening to this as an event.
     *
     * @abstract
     * @param {Function} listener The event listener.
     * @returns {boolean} Whether `listener` is registered with this as an event.
     * @see EventManager.hasListener
     */
    hasListener(listener: Function): boolean
    /**
     * Unregisters `listener` from this as an event.
     *
     * @abstract
     * @param {Function} listener The event listener.
     * @see EventManager.removeListener
     */
    removeListener(listener: Function): void
    /**
     * Revokes the implementation object, and prevents any further method
     * calls from having external effects.
     *
     * @abstract
     */
    revoke(): void
  }
  /**
   * An object that runs a locally implemented API.
   */
  class LocalAPIImplementation extends SchemaAPIInterface {
    /**
     * Constructs an implementation of the `name` method or property of `pathObj`.
     *
     * @param {object} pathObj The object containing the member with name `name`.
     * @param {string} name The name of the implemented member.
     * @param {BaseContext} context The context in which the schema is injected.
     */
    constructor(pathObj: object, name: string, context: BaseContext)
    pathObj: object
    name: string
    context: BaseContext
    callFunction(args: any): any
    callFunctionNoReturn(args: any): void
    callAsyncFunction(
      args: any,
      callback: any,
      requireUserInput: any,
    ): Promise<any>
    setProperty(value: any): void
    addListener(listener: any, args: any): void
    hasListener(listener: any): any
    removeListener(listener: any): void
  }
  /**
   * Manages loading and accessing a set of APIs for a specific extension
   * context.
   *
   * @param {BaseContext} context
   *        The context to manage APIs for.
   * @param {SchemaAPIManager} apiManager
   *        The API manager holding the APIs to manage.
   * @param {object} root
   *        The root object into which APIs will be injected.
   */
  class CanOfAPIs {
    constructor(context: any, apiManager: any, root: any)
    context: any
    scopeName: any
    apiManager: any
    root: any
    apiPaths: Map<any, any>
    apis: Map<any, any>
    /**
     * Synchronously loads and initializes an ExtensionAPI instance.
     *
     * @param {string} name
     *        The name of the API to load.
     */
    loadAPI(name: string): void
    /**
     * Asynchronously loads and initializes an ExtensionAPI instance.
     *
     * @param {string} name
     *        The name of the API to load.
     */
    asyncLoadAPI(name: string): Promise<void>
    /**
     * Finds the API at the given path from the root object, and
     * synchronously loads the API that implements it if it has not
     * already been loaded.
     *
     * @param {string} path
     *        The "."-separated path to find.
     * @returns {*}
     */
    findAPIPath(path: string): any
    /**
     * Finds the API at the given path from the root object, and
     * asynchronously loads the API that implements it if it has not
     * already been loaded.
     *
     * @param {string} path
     *        The "."-separated path to find.
     * @returns {Promise<*>}
     */
    asyncFindAPIPath(path: string): Promise<any>
  }
  /**
   * @class APIModule
   * @abstract
   *
   * @property {string} url
   *       The URL of the script which contains the module's
   *       implementation. This script must define a global property
   *       matching the modules name, which must be a class constructor
   *       which inherits from {@link ExtensionAPI}.
   *
   * @property {string} schema
   *       The URL of the JSON schema which describes the module's API.
   *
   * @property {Array<string>} scopes
   *       The list of scope names into which the API may be loaded.
   *
   * @property {Array<string>} manifest
   *       The list of top-level manifest properties which will trigger
   *       the module to be loaded, and its `onManifestEntry` method to be
   *       called.
   *
   * @property {Array<string>} events
   *       The list events which will trigger the module to be loaded, and
   *       its appropriate event handler method to be called. Currently
   *       only accepts "startup".
   *
   * @property {Array<string>} permissions
   *       An optional list of permissions, any of which must be present
   *       in order for the module to load.
   *
   * @property {Array<Array<string>>} paths
   *       A list of paths from the root API object which, when accessed,
   *       will cause the API module to be instantiated and injected.
   */
  /**
   * This object loads the ext-*.js scripts that define the extension API.
   *
   * This class instance is shared with the scripts that it loads, so that the
   * ext-*.js scripts and the instantiator can communicate with each other.
   */
  class SchemaAPIManager extends EventEmitter {
    /**
     * @param {string} processType
     *     "main" - The main, one and only chrome browser process.
     *     "addon" - An addon process.
     *     "content" - A content process.
     *     "devtools" - A devtools process.
     * @param {SchemaRoot} schema
     */
    constructor(processType: string, schema: SchemaRoot)
    processType: string
    global: object
    schema: any
    modules: Map<any, any>
    modulePaths: {
      children: Map<any, any>
      modules: Set<any>
    }
    manifestKeys: Map<any, any>
    eventModules: any
    settingsModules: Set<any>
    _modulesJSONLoaded: boolean
    schemaURLs: Map<any, any>
    apis: any
    _scriptScopes: any[]
    onStartup(extension: any): Promise<any[]>
    loadModuleJSON(urls: any): Promise<any>
    initModuleJSON(blobs: any): any
    initModuleData(moduleData: any): void
    /**
     * Registers a set of ExtensionAPI modules to be lazily loaded and
     * managed by this manager.
     *
     * @param {object} obj
     *        An object containing property for eacy API module to be
     *        registered. Each value should be an object implementing the
     *        APIModule interface.
     */
    registerModules(obj: object): void
    /**
     * Emits an `onManifestEntry` event for the top-level manifest entry
     * on all relevant {@link ExtensionAPI} instances for the given
     * extension.
     *
     * The API modules will be synchronously loaded if they have not been
     * loaded already.
     *
     * @param {Extension} extension
     *        The extension for which to emit the events.
     * @param {string} entry
     *        The name of the top-level manifest entry.
     *
     * @returns {*}
     */
    emitManifestEntry(extension: Extension, entry: string): any
    /**
     * Emits an `onManifestEntry` event for the top-level manifest entry
     * on all relevant {@link ExtensionAPI} instances for the given
     * extension.
     *
     * The API modules will be asynchronously loaded if they have not been
     * loaded already.
     *
     * @param {Extension} extension
     *        The extension for which to emit the events.
     * @param {string} entry
     *        The name of the top-level manifest entry.
     *
     * @returns {Promise<*>}
     */
    asyncEmitManifestEntry(extension: Extension, entry: string): Promise<any>
    /**
     * Returns the {@link ExtensionAPI} instance for the given API module,
     * for the given extension, in the given scope, synchronously loading
     * and instantiating it if necessary.
     *
     * @param {string} name
     *        The name of the API module to load.
     * @param {Extension} extension
     *        The extension for which to load the API.
     * @param {string} [scope = null]
     *        The scope type for which to retrieve the API, or null if not
     *        being retrieved for a particular scope.
     *
     * @returns {ExtensionAPI?}
     */
    getAPI(
      name: string,
      extension: Extension,
      scope?: string,
    ): ExtensionAPI | null
    /**
     * Returns the {@link ExtensionAPI} instance for the given API module,
     * for the given extension, in the given scope, asynchronously loading
     * and instantiating it if necessary.
     *
     * @param {string} name
     *        The name of the API module to load.
     * @param {Extension} extension
     *        The extension for which to load the API.
     * @param {string} [scope = null]
     *        The scope type for which to retrieve the API, or null if not
     *        being retrieved for a particular scope.
     *
     * @returns {Promise<ExtensionAPI>?}
     */
    asyncGetAPI(
      name: string,
      extension: Extension,
      scope?: string,
    ): Promise<ExtensionAPI> | null
    /**
     * Synchronously loads an API module, if not already loaded, and
     * returns its ExtensionAPI constructor.
     *
     * @param {string} name
     *        The name of the module to load.
     */
    loadModule(name: string): unknown
    /**
     * aSynchronously loads an API module, if not already loaded, and
     * returns its ExtensionAPI constructor.
     *
     * @param {string} name
     *        The name of the module to load.
     *
     * @returns {Promise<class>}
     */
    asyncLoadModule(name: string): Promise<any>
    asyncLoadSettingsModules(): Promise<any[]>
    getModule(name: any): any
    /**
     * Checks whether the given API module may be loaded for the given
     * extension, in the given scope.
     *
     * @param {string} name
     *        The name of the API module to check.
     * @param {Extension} extension
     *        The extension for which to check the API.
     * @param {string} [scope = null]
     *        The scope type for which to check the API, or null if not
     *        being checked for a particular scope.
     *
     * @returns {boolean}
     *        Whether the module may be loaded.
     */
    _checkGetAPI(name: string, extension: Extension, scope?: string): boolean
    _checkLoadModule(module: any, name: any): void
    /**
     * Create a global object that is used as the shared global for all ext-*.js
     * scripts that are loaded via `loadScript`.
     *
     * @returns {object} A sandbox that is used as the global by `loadScript`.
     */
    _createExtGlobal(): object
    initGlobal(): void
    /**
     * Load an ext-*.js script. The script runs in its own scope, if it wishes to
     * share state with another script it can assign to the `global` variable. If
     * it wishes to communicate with this API manager, use `extensions`.
     *
     * @param {string} scriptUrl The URL of the ext-*.js script.
     */
    loadScript(scriptUrl: string): void
  }
  /**
   * This is a generic class for managing event listeners.
   *
   * @example
   * new EventManager({
   *   context,
   *   name: "api.subAPI",
   *   register:  fire => {
   *     let listener = (...) => {
   *       // Fire any listeners registered with addListener.
   *       fire.async(arg1, arg2);
   *     };
   *     // Register the listener.
   *     SomehowRegisterListener(listener);
   *     return () => {
   *       // Return a way to unregister the listener.
   *       SomehowUnregisterListener(listener);
   *     };
   *   }
   * }).api()
   *
   * The result is an object with addListener, removeListener, and
   * hasListener methods. `context` is an add-on scope (either an
   * ExtensionContext in the chrome process or ExtensionContext in a
   * content process).
   */
  class EventManager {
    static _initPersistentListeners(extension: any): boolean
    static _writePersistentListeners(extension: any): void
    static primeListeners(extension: any, isInStartup?: boolean): void
    /**
     * This is called as a result of background script startup-finished and shutdown.
     *
     * After startup, it removes any remaining primed listeners.  These exist if the
     * listener was not renewed during startup.  In this case the persisted listener
     * data is also removed.
     *
     * During shutdown, care should be taken to set clearPersistent to false.
     * persisted listener data should NOT be cleared during shutdown.
     *
     * @param {Extension} extension
     * @param {boolean} clearPersistent whether the persisted listener data should be cleared.
     */
    static clearPrimedListeners(
      extension: Extension,
      clearPersistent?: boolean,
    ): void
    static savePersistentListener(
      extension: any,
      module: any,
      event: any,
      args?: any[],
    ): any[]
    static clearPersistentListener(
      extension: any,
      module: any,
      event: any,
      key?: any,
      primeId?: any,
    ): void
    constructor(params: any)
    context: any
    module: any
    event: any
    name: any
    register: any
    inputHandling: any
    resetIdleOnEvent: any
    canPersistEvents: any
    unregister: Map<any, any>
    remove: Map<any, any>
    addListener(callback: any, ...args: any[]): void
    removeListener(callback: any, clearPersistentListener?: boolean): void
    hasListener(callback: any): boolean
    revoke(): void
    close(): void
    api(): {
      [x: number]: () => void
      addListener: (...args: any[]) => void
      removeListener: (...args: any[]) => void
      hasListener: (...args: any[]) => boolean
      setUserInput: any
    }
  }
  const LISTENERS: unique symbol
  const ONCE_MAP: unique symbol

  interface TabAttachedEvent {
    /** The native tab object in the window to which the tab is being attached. This may be a different object than was used to represent the tab in the old window. */
    tab: NativeTab

    /** The ID of the tab being attached. */
    tabId: number

    /** The ID of the window to which the tab is being attached. */
    newWindowId: number

    /** The position of the tab in the tab list of the new window. */
    newPosition: number
  }

  interface TabDetachedEvent {
    /** The native tab object in the window from which the tab is being detached. This may be a different object than will be used to represent the tab in the new window. */
    tab: NativeTab

    /** The native tab object in the window to which the tab will be attached, and is adopting the contents of this tab. This may be a different object than the tab in the previous window. */
    adoptedBy: NativeTab

    /** The ID of the tab being detached. */
    tabId: number

    /** The ID of the window from which the tab is being detached. */
    oldWindowId: number

    /** The position of the tab in the tab list of the window from which it is being detached. */
    oldPosition: number
  }

  interface TabCreatedEvent {
    /** The native tab object for the tab which is being created. */
    tab: NativeTab
  }

  interface TabRemovedEvent {
    /** The native tab object for the tab which is being removed. */
    tab: NativeTab

    /** The ID of the tab being removed. */
    tabId: number

    /** The ID of the window from which the tab is being removed. */
    windowId: number

    /** True if the tab is being removed because the window is closing. */
    isWindowClosing: boolean
  }

  interface BrowserData {
    /** The numeric ID of the tab that a <browser> belongs to, or -1 if it does not belong to a tab. */
    tabId: number

    /** The numeric ID of the browser window that a <browser> belongs to, or -1 if it does not belong to a browser window. */
    windowId: number
  }

  type NativeTab = any
  type XULElement = any

  /**
   * A platform-independent base class for the platform-specific TabTracker
   * classes, which track the opening and closing of tabs, and manage the mapping
   * of them between numeric IDs and native tab objects.
   */
  abstract class TabTrackerBase extends EventEmitter {
    protected initialized: boolean

    on(...args: any[]): void

    /**
     * Called to initialize the tab tracking listeners the first time that an
     * event listener is added.
     */
    protected abstract init(): void

    /**
     * Returns the numeric ID for the given native tab.
     *
     * @param nativeTab The native tab for which to return an ID.
     * @returns The tab's numeric ID.
     */
    abstract getId(nativeTab: NativeTab): number

    /**
     * Returns the native tab with the given numeric ID.
     *
     * @param tabId The numeric ID of the tab to return.
     * @param default_ The value to return if no tab exists with the given ID.
     * @returns The native tab.
     * @throws If no tab exists with the given ID and a default return value is not provided.
     */
    abstract getTab(tabId: number, default_?: any): NativeTab

    /**
     * Returns basic information about the tab and window that the given browser
     * belongs to.
     *
     * @param browser The XUL browser element for which to return data.
     * @returns Browser data.
     */
    abstract getBrowserData(browser: XULElement): BrowserData

    /**
     * Returns the native tab object for the active tab in the
     * most-recently focused window, or null if no live tabs currently
     * exist.
     */
    abstract get activeTab(): NativeTab | null
  }
}

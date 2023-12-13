/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/// <reference path="../link.d.ts" />
import { lazyESModuleGetters } from 'resource://app/modules/TypedImportUtils.sys.mjs'

const lazy = lazyESModuleGetters({
  ActorManagerParent: 'resource://gre/modules/ActorManagerParent.sys.mjs',
})

const JS_PROCESS_ACTORS = {}
const JS_WINDOW_ACTORS = {
  ContextMenu: {
    parent: {
      esModuleURI: 'resource://app/actors/ContextMenuParent.sys.mjs',
    },

    child: {
      esModuleURI: 'resource://app/actors/ContextMenuChild.sys.mjs',
      events: {
        contextmenu: { mozSystemGroup: true },
      },
    },

    messageManagerGroups: ['browsers'],
    allFrames: true,
  },

  LinkHandler: {
    parent: {
      esModuleURI: 'resource://app/actors/LinkHandlerParent.sys.mjs',
    },
    child: {
      esModuleURI: 'resource://app/actors/LinkHandlerChild.sys.mjs',
      events: {
        DOMHeadElementParsed: {},
        DOMLinkAdded: {},
        DOMLinkChanged: {},
        pageshow: {},
        // The `pagehide` event is only used to clean up state which will not be
        // present if the actor hasn't been created.
        pagehide: { createActor: false },
      },
    },
    messageManagerGroups: ['browsers'],
  },
}

export class BrowserGlue {
  QueryInterface = ChromeUtils.generateQI(['nsIObserver'])

  constructor() {
    lazy.ActorManagerParent.addJSProcessActors(JS_PROCESS_ACTORS)
    lazy.ActorManagerParent.addJSWindowActors(JS_WINDOW_ACTORS)
  }

  // nsIObserver impl
  observe(aSubject: nsISupportsType, aTopic: string, aData: string): void {
    // eslint-disable-next-line no-console
    console.log({ aSubject, aTopic, aData })
  }

  initializeDevtools() {
    const { loader, require, DevToolsLoader } =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ChromeUtils as any).importESModule(
        'resource://devtools/shared/loader/Loader.sys.mjs',
      )

    const { DevToolsServer } = require('devtools/server/devtools-server')

    // Make the loader visible to the debugger by default and for the already
    // loaded instance. Thunderbird now also provides the Browser Toolbox for
    // chrome debugging, which uses its own separate loader instance.
    DevToolsLoader.prototype.invisibleToDebugger = false
    loader.invisibleToDebugger = false
    DevToolsServer.allowChromeProcess = true

    // Initialize and load the toolkit/browser actors. This will also call above function to set the
    // Thunderbird root actor
    DevToolsServer.init()
    DevToolsServer.registerAllActors()
  }
}

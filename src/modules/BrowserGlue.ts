/// <reference types="gecko-types" />

import { lazyESModuleGetters } from 'resource://app/modules/TypedImportUtils.sys.mjs'

const lazy = lazyESModuleGetters({
  ActorManagerParent: 'resource://gre/modules/ActorManagerParent.sys.mjs',
})

const JS_PROCESS_ACTORS = {}
const JS_WINDOW_ACTORS = {
  LinkHandler: {
    parent: {
      moduleURI: 'resource://app/actors/LinkHandlerParent.jsm',
    },
    child: {
      moduleURI: 'resource://app/actors/LinkHandlerChild.jsm',
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
    console.log('BrowserGlue impl')

    lazy.ActorManagerParent.addJSProcessActors(JS_PROCESS_ACTORS)
    lazy.ActorManagerParent.addJSWindowActors(JS_WINDOW_ACTORS)
  }

  // nsIObserver impl
  observe(aSubject: nsISupportsType, aTopic: string, aData: string): void {
    console.log({ aSubject, aTopic, aData })
  }
}

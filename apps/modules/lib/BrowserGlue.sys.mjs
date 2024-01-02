/// @ts-check
/// <reference types="@browser/link" />
import { lazyESModuleGetters } from 'resource://app/modules/TypedImportUtils.sys.mjs'

const lazy = lazyESModuleGetters({
  ActorManagerParent: 'resource://gre/modules/ActorManagerParent.sys.mjs',
})

const JS_PROCESS_ACTORS = {}
const JS_WINDOW_ACTORS = {
  ClickHandler: {
    parent: { esModuleURI: 'resource://app/actors/ClickHandlerParent.sys.mjs' },
    child: {
      esModuleURI: 'resource://app/actors/ClickHandlerChild.sys.mjs',
      events: {
        chromelinkclick: { capture: true, mozSystemGroup: true },
      },
    },

    allFrames: true,
  },

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
  observe(aSubject, aTopic, aData) {
    // eslint-disable-next-line no-console
    console.log({ aSubject, aTopic, aData })
  }
}

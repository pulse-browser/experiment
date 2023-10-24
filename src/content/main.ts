/// <reference types="gecko-types" />

import 'remixicon/fonts/remixicon.css'

import './global.css'
import './lib/globalApi'

import App from './App.svelte'
import { initializeShortcuts } from './lib/shortcuts'

// TODO: WTF is this and do we care
// This needs setting up before we create the first remote browser.
// window.docShell.treeOwner
//  .QueryInterface(Ci.nsIInterfaceRequestor)
//  .getInterface(Ci.nsIAppWindow).XULBrowserWindow = window.XULBrowserWindow
//window.browserDOMWindow = new nsBrowserAccess()

const app = new App({
  target: document.body,
})

setTimeout(() => {
  initializeShortcuts()
}, 1)

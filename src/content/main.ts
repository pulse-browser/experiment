/// <reference types="gecko-types" />

import App from './App.svelte'

// TODO: WTF is this and do we care
// This needs setting up before we create the first remote browser.
// window.docShell.treeOwner
//  .QueryInterface(Ci.nsIInterfaceRequestor)
//  .getInterface(Ci.nsIAppWindow).XULBrowserWindow = window.XULBrowserWindow
//window.browserDOMWindow = new nsBrowserAccess()

const app = new App({
  target: document.body,
})

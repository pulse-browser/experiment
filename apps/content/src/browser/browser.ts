/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/// <reference types="gecko-types" />
import 'remixicon/fonts/remixicon.css'

import '@shared/styles/window.css'

import App from './Browser.svelte'
import './browser.css'
import { initializeShortcuts } from './lib/shortcuts'
import { initializeWindow } from './lib/window'
import './lib/window/api'

// TODO: WTF is this and do we care
// This needs setting up before we create the first remote browser.
// window.docShell.treeOwner
//  .QueryInterface(Ci.nsIInterfaceRequestor)
//  .getInterface(Ci.nsIAppWindow).XULBrowserWindow = window.XULBrowserWindow
//window.browserDOMWindow = new nsBrowserAccess()

initializeWindow(window.arguments && window.arguments[0])

new App({
  target: document.body,
})

setTimeout(() => {
  initializeShortcuts()
}, 1)

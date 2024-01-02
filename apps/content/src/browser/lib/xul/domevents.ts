/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { Deferred } from '@experiment/shared'

import { NSBrowserAccess } from './NSBrowserAccess'
import { globalXULBrowserWindow } from './XULBrowserWindow'

export const domContentLoaded: Deferred<null> = new Deferred()
window.addEventListener(
  'load',
  () => {
    // This code needs to be run before the first remote browser is created
    window.docShell.treeOwner
      .QueryInterface(Ci.nsIInterfaceRequestor)
      .getInterface(Ci.nsIAppWindow).XULBrowserWindow = globalXULBrowserWindow
    window.browserDOMWindow =
      new NSBrowserAccess() as unknown as nsIBrowserDOMWindowType

    domContentLoaded.resolve && domContentLoaded.resolve(null)
  },
  {
    once: true,
  },
)

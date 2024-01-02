/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { resource } from '../resources'
import { type WindowArguments, getFullWindowConfiguration } from './arguments'
import { openTab } from './tabs'
import {
  initializeWindowDragOverHandler,
  registerWithWindowTracker,
} from './window'

export function initializeWindow(args: WindowArguments | undefined) {
  // When opened via nsIWindowWatcher.openWindow, the arguments are
  // passed through C++, and they arrive to us wrapped as an XPCOM
  // object. We use wrappedJSObject to get at the underlying JS
  // object.
  // @ts-expect-error Incorrect type generation
  if (args instanceof Ci.nsISupports) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args = (args as any).wrappedJSObject as WindowArguments
  }

  const configuration = getFullWindowConfiguration(args || {})

  // Setup tabs
  openTab(resource.NetUtil.newURI(configuration.initialUrl))

  initializeWindowDragOverHandler()
  registerWithWindowTracker()
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { TAB_DATA_TYPE } from '@browser/components/tabs/tabDrag'

import { resource } from '../resources'
import { type WindowArguments, getFullWindowConfiguration } from './arguments'
import { openTab } from './tabs'

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

/**
 * If we want to detect drops outside of the window, we need to ensure that all
 * drops **within** a browser window are handled.
 *
 * This listens for all events with a type equivalent to {@link TAB_DATA_TYPE}
 * and makes sure they have an attached drop type.
 */
function initializeWindowDragOverHandler() {
  const handleDragEvent = (event: DragEvent) => {
    const rawDragRepresentation = event.dataTransfer?.getData(TAB_DATA_TYPE)
    if (!rawDragRepresentation) return

    // Set this to some drop event other than 'none' so we can detect drops
    // outside of the window in the tab's drag handler
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'link'
    event.preventDefault()
  }

  window.addEventListener('dragover', handleDragEvent)
  window.addEventListener('drop', handleDragEvent)
}

/**
 * Ensures that the window tracker is aware of this window & that when it is
 * closed, the correct cleanup is performed.
 */
function registerWithWindowTracker() {
  resource.WindowTracker.registerWindow(window)
  window.addEventListener('unload', () =>
    resource.WindowTracker.removeWindow(window),
  )
}

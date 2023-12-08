/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { resource } from '../resources'
import { type WindowArguments, getFullWindowConfiguration } from './arguments'
import { openTab } from './tabs'

export function initializeWindow(args: WindowArguments | undefined) {
  const configuration = getFullWindowConfiguration(args || {})

  // Setup tabs
  openTab(resource.NetUtil.newURI(configuration.initialUrl))
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/no-explicit-any */

const lazy: any = {}
;(ChromeUtils as any).defineESModuleGetters(lazy, {
  BrowserToolboxLauncher:
    'resource://devtools/client/framework/browser-toolbox/Launcher.sys.mjs',
})

export const initDevTools = lazy.BrowserToolboxLauncher.init

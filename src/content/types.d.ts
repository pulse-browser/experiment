/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/// <reference types="gecko-types" />
/// <reference types="svelte" />

/// <reference path='./contentAreaUtils' />
/// <reference path='./globalOverlay' />

declare module '*.txt' {
  const contents: string
  export = contents
}

declare interface Window {
  windowApi: typeof import('./browser/lib/window/api').windowApi
  browserDOMWindow: nsIBrowserDOMWindowType
  /**
   * Arguments that may be passed into a specific window. We control these types
   *
   * @see {@link file://./browser/lib/window/arguments.ts}
   */
  arguments?: [import('./browser/lib/window/arguments').WindowArguments]
}

declare interface NodeModule {
  hot?: {
    dispose: (cb: () => void) => void
  }
}

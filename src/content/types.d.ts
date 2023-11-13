/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/// <reference types="gecko-types" />
/// <reference types="svelte" />

declare module '*.txt' {
  const contents: string
  export = contents
}

declare interface Window {
  windowApi: typeof import('./lib/globalApi').windowApi
}

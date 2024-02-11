/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

declare module 'resource://app/modules/TestManager.sys.mjs' {
  import type { ISpecFunction, ITestOptions, IAssert } from 'zora'

  export type BrowserTestFunction = (window: Window) => ISpecFunction

  export type IDefaultAssert = IAssert & {
    onCleanup: (fn: (assert: IDefaultAssert) => Promise<void> | void) => void
  }

  export type Test = {
    name: string
    spec: BrowserTestFunction
    options?: ITestOptions
  }

  export interface TestManagerInterface {
    test(
      description: string,
      assertFn: (assert: IDefaultAssert) => Promise<void> | void,
    ): Promise<void>
    withBrowser(
      defaultUrl: string,
      using: (win: Window) => Promise<void>,
    ): Promise<void>

    report(): Promise<void>
  }

  export const TestManager: TestManagerInterface
}

declare interface MozESMExportFile {
  TestManager: 'resource://app/modules/TestManager.sys.mjs'
}

declare interface MozESMExportType {
  TestManager: typeof import('resource://app/modules/TestManager.sys.mjs').TestManager
}

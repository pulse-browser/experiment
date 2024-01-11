declare module 'resource://app/modules/TestManager.sys.mjs' {
  import type { ISpecFunction, ITestOptions } from 'zora'

  export type BrowserTestFunction = (window: Window) => ISpecFunction

  export type Test = {
    name: string
    spec: BrowserTestFunction
    options?: ITestOptions
  }

  export interface TestManagerInterface {
    browserTest(
      name: string,
      spec: BrowserTestFunction,
      options?: ITestOptions,
    ): void
    call(): Promise<void>
  }

  export const TestManager: TestManagerInterface
}

declare interface MozESMExportFile {
  TestManager: 'resource://app/modules/TestManager.sys.mjs'
}

declare interface MozESMExportType {
  TestManager: typeof import('resource://app/modules/TestManager.sys.mjs').TestManager
}

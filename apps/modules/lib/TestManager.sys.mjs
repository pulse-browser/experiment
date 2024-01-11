// @ts-check
/// <reference types="@browser/link" />
import {
  createTAPReporter,
  hold,
  report,
  test,
} from 'resource://app/modules/zora.sys.mjs'

const TEST_PORT = 3948

/** @typedef {import('resource://app/modules/TestManager.sys.mjs').TestManagerInterface} TestManagerInst */

/** @implements {TestManagerInst} */
class TestManagerSingleton {
  /**
   * @private
   * @type {import('resource://app/modules/TestManager.sys.mjs').Test[]}
   */
  tests = []

  /**
   * @param {string} name
   * @param {import('resource://app/modules/TestManager.sys.mjs').BrowserTestFunction} spec
   * @param {import('resource://app/modules/zora.sys.mjs').ITestOptions} [options]
   */
  browserTest(name, spec, options) {
    this.tests.push({ name, spec, options })
  }

  async call() {
    hold()

    console.log('Starting tests')
    let testIndex = 0
    for (const { name, spec, options } of this.tests) {
      testIndex += 1
      console.time(`test-${testIndex}`)
      /** @type {Window} */
      // @ts-expect-error Incorrect type gen
      const window = Services.ww.openWindow(
        // @ts-expect-error Incorrect type generation
        null,
        Services.prefs.getStringPref('app.content'),
        '_blank',
        'chrome,dialog=no,all',
        undefined,
      )

      await new Promise((res) =>
        window.addEventListener('DOMContentLoaded', res),
      )
      const testFn = spec(window)
      await test(name, testFn, options)
      window.close()
      console.time(`test-${testIndex}`)
    }

    let log = ''
    const reporter = createTAPReporter({ log: (s) => (log += s + '\n') })
    await report({ reporter })

    await fetch(`http://localhost:${TEST_PORT}/results`, {
      method: 'POST',
      body: log,
    })
  }
}

export const TestManager = new TestManagerSingleton()

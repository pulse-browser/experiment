/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
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

// Tell the test reporter not to output to console straight away
hold()

/** @implements {TestManagerInst} */
class TestManagerSingleton {
  /**
   * @public
   * @param {string} descr
   * @param {(assert: import('resource://app/modules/TestManager.sys.mjs').IDefaultAssert) => Promise<void> | void} assertFn
   */
  async test(descr, assertFn) {
    const cleanup = []

    return await test(descr, async (assert) => {
      /** @type {import('resource://app/modules/TestManager.sys.mjs').IDefaultAssert} */
      const newAssert = {
        ...assert,
        onCleanup: (cleanupFn) => void cleanup.push(cleanupFn),
      }

      const ret = await assertFn(newAssert)

      for (let i = 0; i < cleanup.length; i++) {
        const fn = cleanup[i]
        await fn(newAssert)
      }

      return ret
    })
  }

  /**
   * @param {string} initialUrl
   * @param {(win: Window) => Promise<void>} using
   */
  async withBrowser(initialUrl, using) {
    /** @type {WindowConfiguration} */
    const args = { initialUrl }

    /** @type {Window} */
    // @ts-expect-error Incorrect type gen
    const window = Services.ww.openWindow(
      // @ts-expect-error Incorrect type generation
      null,
      Services.prefs.getStringPref('app.content'),
      '_blank',
      'chrome,dialog=no,all',
      args,
    )

    await new Promise((res) => window.addEventListener('DOMContentLoaded', res))
    await using(window)
    window.close()
  }

  async report() {
    let log = ''
    const reporter = createTAPReporter({
      log: (s) => {
        log += s + '\n'
      },
    })
    await report({ reporter })

    console.log(log)
    await fetch(`http://localhost:${TEST_PORT}/results`, {
      method: 'POST',
      body: log,
    })
  }
}

export const TestManager = new TestManagerSingleton()

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-check
import { createTAPReporter, hold, report } from 'zora'

const TEST_PORT = 3948
const TEST_OUTPUT = document.createElement('pre')

document.body.appendChild(TEST_OUTPUT)

/**
 * @param {() => Promise<void>} tests
 * @returns {Promise<(tests: () => Promise<void>) => Promise<void>>}
 */
export async function manageTests(tests) {
  /** @type {{ shouldWatch: boolean }} */
  const config = await fetch(`http://localhost:${TEST_PORT}/config`).then((r) =>
    r.json(),
  )

  /**
   * @param {() => Promise<void>} tests
   */
  async function performTests(tests) {
    hold()
    await tests()

    let log = ''
    const reporter = createTAPReporter({
      log: (s) => {
        log += s + '\n'
        TEST_OUTPUT.innerHTML = log
      },
    })
    await report({ reporter })
    TEST_OUTPUT.innerHTML = log

    // Send the report back to the test runner
    await fetch(`http://localhost:${TEST_PORT}/results`, {
      method: 'POST',
      body: log,
    })
  }

  await performTests(tests)

  // If we aren't watching, close the window when the tests are done
  if (!config.shouldWatch) {
    window.close()
  }

  return performTests
}

/**
 * @template T
 * @typedef {Object} IAssertionResult
 * @property {boolean} pass
 * @property {unknown} actual
 * @property {T} expected
 * @property {string} description
 * @property {string} operator
 * @property {string} [at]
 */

/**
 * @template T
 * @param {import('zora').IAssert} t
 * @param {IAssertionResult<T>} result
 * @param {string} description
 * @param {import('zora').ISpecFunction} fn
 */
export async function then(t, result, description, fn) {
  const restFn = result.pass ? t.test : t.skip
  restFn(description, fn)
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import {
  type IAssert,
  type ISpecFunction,
  createTAPReporter,
  hold,
  report,
} from 'zora'

const TEST_PORT = 3948
const TEST_OUTPUT = document.createElement('pre')

document.body.appendChild(TEST_OUTPUT)

export async function manageTests(
  tests: () => Promise<void>,
): Promise<(tests: () => Promise<void>) => Promise<void>> {
  const config = (await fetch(`http://localhost:${TEST_PORT}/config`).then(
    (r) => r.json(),
  )) as { shouldWatch: boolean }

  async function performTests(tests: () => Promise<void>) {
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

interface IAssertionResult<T> {
  pass: boolean
  actual: unknown
  expected: T
  description: string
  operator: string
  at?: string
}

export async function then<T>(
  t: IAssert,
  result: IAssertionResult<T>,
  description: string,
  fn: ISpecFunction,
) {
  const restFn = result.pass ? t.test : t.skip
  restFn(description, fn)
}

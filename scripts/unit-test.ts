/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { App } from '@tinyhttp/app'
import { type ExecaChildProcess, execa } from 'execa'
import { argv, exit } from 'node:process'

// If you update this port, you should update the port in the test runner
const TEST_PORT = 3948
const TEST_RUNNER_URL = 'chrome://browser/content/tests/index.html'

const shouldWatch = argv.includes('--watch')
let testProcess: ExecaChildProcess<string>

// This is the way that the test runner communicates with the test app
new App()
  .get('/config', (_, res) => void res.send({ shouldWatch }))
  .post('/results', (req, res) => {
    req.on('data', (chunk: Buffer) => {
      // eslint-disable-next-line no-console
      console.log(chunk.toString())
    })
    req.on('close', () => {
      res.send('ok')

      if (!shouldWatch) {
        testProcess?.kill()
        exit()
      }
    })
  })
  .listen(TEST_PORT)

if (!shouldWatch) {
  testProcess = execa('./.store/rt/quark-runtime', [
    '--no-remote',
    '--chrome',
    TEST_RUNNER_URL,
  ])

  // Timeout to ensure that tests actually start
  setTimeout(() => {
    testProcess?.kill()
    exit(1)
  }, 10_000)
}

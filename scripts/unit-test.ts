/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/// <reference path="./scripts.d.ts" />
import { App } from '@tinyhttp/app'
import { type ExecaChildProcess, execa } from 'execa'
import { createWriteStream } from 'node:fs'
import { argv, exit } from 'node:process'
import tapSpec from 'tap-spec'

// If you update this port, you should update the port in the test runner
const TEST_PORT = 3948
const WEBPACK_TEST_RUNNER_URL = 'chrome://browser/content/tests/index.html'
const MODULES_TEST_RUNNER_URL = 'chrome://browser/content/gtests.html'

const shouldWatch = argv.includes('--watch')

function runner(testPage: string) {
  if (shouldWatch) return

  const testProcess = execa('./.store/rt/quark-runtime', [
    '--no-remote',
    '--chrome',
    testPage,
  ])

  testProcess.on('message', (msg) => console.log(msg.toString()))

  // Timeout to ensure that tests actually start
  const timeout = setTimeout(() => {
    testProcess?.kill()
    console.error('Process timed out')
    exit(1)
  }, 10_000)

  testProcess.on('exit', () => clearTimeout(timeout))

  return testProcess
}

/**
 * @param testProcess If a process was spawned by the test runner. This process will be shut down, along with the server on a result
 */
function createTestReporter(
  name: string,
  testProcess?: ExecaChildProcess<string>,
) {
  return new Promise<void>((resolve) => {
    const app = new App()
    const server = app
      .get('/config', (_, res) => void res.send({ shouldWatch }))
      .post('/results', (req, res) => {
        // Provide a nice reporter to the console
        req.pipe(tapSpec()).pipe(process.stdout)

        if (testProcess) {
          req
            .pipe(createWriteStream(`./.store/${name}.tap`))
            .on('close', () => {
              testProcess.kill()
              server.close()
              resolve()
            })
        }

        req.on('close', () => res.send('ok'))
      })
      .listen(TEST_PORT)
  })
}

await createTestReporter('webpack', runner(WEBPACK_TEST_RUNNER_URL))
await createTestReporter('modules', runner(MODULES_TEST_RUNNER_URL))

exit(0)

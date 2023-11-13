import { hold, report, createTAPReporter } from 'zora'

const TEST_PORT = 3948
const TEST_OUTPUT = document.createElement('pre')

document.body.appendChild(TEST_OUTPUT)

export async function manageTests(
  tests: () => Promise<void>,
): Promise<(tests: () => Promise<void>) => Promise<void>> {
  const config = await fetch(`http://localhost:${TEST_PORT}/config`).then((r) =>
    r.json(),
  )

  async function performTests(tests: () => Promise<void>) {
    hold()
    await tests()

    let log = ''
    const reporter = createTAPReporter({ log: (s) => (log += s + '\n') })
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

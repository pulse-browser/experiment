import { test } from 'zora'
import { manageTests } from './manager'

import shared from './shared'

async function tests() {
  await shared()
}

await manageTests(tests)

if (module.hot) {
  module.hot.dispose(() => window.location.reload())
}

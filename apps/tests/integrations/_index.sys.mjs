import { TestManager } from 'resource://app/modules/TestManager.sys.mjs'

TestManager.browserTest('Has Tabs', (window) => (test) => {
  test.notEq(
    window.document.getElementsByClassName('tabs').length,
    0,
    'There must be at least one element with the class tabs',
  )
})

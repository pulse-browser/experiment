/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-check
/// <reference types="@browser/link" />
import { ExtensionTestUtils } from 'resource://app/modules/ExtensionTestUtils.sys.mjs'
import { TestManager } from 'resource://app/modules/TestManager.sys.mjs'

/**
 * @param {() => boolean} predicate
 * @returns {Promise<void>}
 */
async function spinLock(predicate) {
  while (!predicate()) {
    await new Promise((res) => setTimeout(res, 100))
  }
}

await TestManager.withBrowser('http://example.com/', async (window) => {
  await TestManager.test('Extension Test', async (test) => {
    const extension = ExtensionTestUtils.loadExtension(
      {
        manifest: {
          page_action: {
            default_icon: './flask-line.svg',
            default_popup: 'pageaction.html',
            show_matches: ['<all_urls>'],
          },
        },
        async background() {
          const { browser } = this

          browser.test.assertTrue(true, 'True is true')
          browser.test.assertEq(1, 1, 'EQ')
          browser.test.log('log')
          browser.test.sendMessage('msg')
          browser.test.succeed('succeed')

          browser.test.onMessage.addListener((msg) =>
            setTimeout(() => browser.test.sendMessage(`${msg}:done`), 100),
          )
        },
        files: {
          'flask-line.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.9994 2V4H14.9994V7.24291C14.9994 8.40051 15.2506 9.54432 15.7357 10.5954L20.017 19.8714C20.3641 20.6236 20.0358 21.5148 19.2836 21.8619C19.0865 21.9529 18.8721 22 18.655 22H5.34375C4.51532 22 3.84375 21.3284 3.84375 20.5C3.84375 20.2829 3.89085 20.0685 3.98181 19.8714L8.26306 10.5954C8.74816 9.54432 8.99939 8.40051 8.99939 7.24291V4H7.99939V2H15.9994ZM13.3873 10.0012H10.6115C10.5072 10.3644 10.3823 10.7221 10.2371 11.0724L10.079 11.4335L6.12439 20H17.8734L13.9198 11.4335C13.7054 10.9691 13.5276 10.4902 13.3873 10.0012ZM10.9994 7.24291C10.9994 7.49626 10.9898 7.7491 10.9706 8.00087H13.0282C13.0189 7.87982 13.0119 7.75852 13.0072 7.63704L12.9994 7.24291V4H10.9994V7.24291Z"></path></svg>`,
          'pageaction.html': `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Page Action</title>
            </head>
            <body>
              <h1>Hello world</h1>
            </body>
          </html>`,
        },
      },
      test,
    )

    await extension.startup()

    extension.sendMsg('test')
    await extension.awaitMsg('test:done')

    const pageActionId = `page-action-icon--${extension.extension.id}`
      .replace('@', '')
      .replace('}', '')
      .replace('{', '')
    let pageActionButton = window.document.getElementById(pageActionId)
    test.truthy(pageActionButton, 'Page action must exist')

    await test.test('Page Action - Panel', async (test) => {
      pageActionButton?.click()

      const pageActionPanelId = `page-action-panel--${extension.extension.id}`
        .replace('@', '')
        .replace('}', '')
        .replace('{', '')
      const pageActionPanel = window.document.getElementById(pageActionPanelId)
      test.truthy(pageActionPanel, 'The panel has opened')

      await new Promise((res) => queueMicrotask(res))

      /** @type {XULBrowserElement | null} */
      const browserElement = window.document.querySelector(
        `#${pageActionPanelId} > browser`,
      )

      test.truthy(browserElement, 'Browser element must exist')
      await spinLock(() => browserElement?.mInitialized)
      test.ok('Panel initialized')
    })

    await extension.unload()

    pageActionButton = window.document.getElementById(pageActionId)
    test.falsy(pageActionButton, 'Page action should be removed')

    test.ok(true, 'Test finished')
  })
})

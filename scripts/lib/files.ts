/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { readFile, writeFile } from 'fs/promises'

import { getArtifactFile } from './constants.js'

export const CHANGES: { file: string; append?: string | string[] }[] = [
  {
    file: 'chrome/chrome.manifest',
    append: [
      'locale branding en-US en-US/locale/branding/',
      'resource search-extensions browser/content/browser/search-extensions/ contentaccessible=yes',
      'content bextensions browser/content/extensions/',
    ],
  },
  {
    file: 'components/components.manifest',
    append: [
      'category webextension-modules browser chrome://bextensions/content/ext-browser.json',
      'category webextension-scripts c-browser chrome://bextensions/content/parent/ext-browser.js',
    ],
  },
]

export async function setupFiles() {
  for (const change of CHANGES) {
    const file = getArtifactFile(change.file)
    let contents = await readFile(file, 'utf-8')

    if (change.append) {
      const append = Array.isArray(change.append)
        ? change.append
        : [change.append]
      contents += '\n' + append.join('\n')
    }

    await writeFile(file, contents)
  }
}

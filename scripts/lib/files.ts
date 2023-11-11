import { readFile, writeFile } from 'fs/promises'

import { getArtifactFile } from './constants.js'

export const CHANGES: { file: string; append?: string | string[] }[] = [
  {
    file: 'chrome/chrome.manifest',
    append:
      'resource search-extensions browser/content/browser/search-extensions/ contentaccessible=yes',
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

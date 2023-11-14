/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { readFile, writeFile } from 'node:fs/promises'

const MPL_HEADER = [
  'This Source Code Form is subject to the terms of the Mozilla Public',
  'License, v. 2.0. If a copy of the MPL was not distributed with this',
  'file, You can obtain one at http://mozilla.org/MPL/2.0/.',
]

const FIXES = [
  {
    regex: new RegExp('.*\\.(css|((j|t)s))'),
    commentOpen: '/* ',
    comment: ' * ',
    commentClose: ' */\n',
  },
  {
    regex: new RegExp('.*\\.(html|svg|xml|svelte)'),
    commentOpen: '<!-- ',
    comment: '   - ',
    commentClose: ' -->\n',
  },
]

export function isValidLicense(file: string): boolean {
  const contents = file.split('\n')

  // We need to grab the top 5 lines just in case there are newlines in the
  // comment blocks
  const lines = [
    contents[0],
    contents[1],
    contents[2],
    contents[3],
    contents[4],
  ].join('\n')

  return (
    lines.includes('the Mozilla Public') &&
    lines.includes('If a copy of the MPL was') &&
    lines.includes('http://mozilla.org/MPL/2.0/')
  )
}

export async function autoFix(path: string): Promise<boolean> {
  const fix = FIXES.find(({ regex }) => regex.test(path))
  if (!fix) return false

  const { comment, commentOpen, commentClose } = fix
  let fileHeader = MPL_HEADER.map((line) => (comment || '') + line).join('\n')

  // On comment open, we want to remove the first comment character, because they
  // generally overlap
  if (commentOpen) fileHeader = commentOpen + fileHeader.replace(comment, '')
  if (commentClose) fileHeader = fileHeader + commentClose

  const contents = await readFile(path, { encoding: 'utf-8' })
  await writeFile(path, fileHeader + '\n' + contents)

  return true
}

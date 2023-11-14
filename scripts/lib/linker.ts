/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { readFile, rm, symlink } from 'fs/promises'
import { existsSync } from 'node:fs'

import { getArtifactFile, getDistFile, getSrcFile } from './constants.js'

export async function linkFolder(folderName: string) {
  const linkFile = await readFile(
    getSrcFile(`${folderName}/link.json`),
    'utf-8',
  )
  const links = JSON.parse(linkFile)

  for (const link of links) {
    const distFileName = `${link}.js`
    const geckoName = `${link}.sys.mjs`
    const geckoPath = getArtifactFile(`${folderName}/${geckoName}`)

    if (existsSync(geckoPath)) await rm(geckoPath)
    await symlink(getDistFile(`${folderName}/${distFileName}`), geckoPath)
  }
}

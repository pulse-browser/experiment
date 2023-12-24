/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { mkdir, readFile, rm, symlink } from 'fs/promises'
import { existsSync } from 'node:fs'
import { dirname } from 'path'

import {
  getArtifactFile,
  getDistFile,
  getSrcFile,
  getStaticFile,
} from './constants.js'

export async function linkTscFolder(folderName: string) {
  const linkFile = await readFile(
    getSrcFile(`${folderName}/link.json`),
    'utf-8',
  )
  const links = JSON.parse(linkFile) as string[]

  for (const link of links) {
    const distFileName = `${link}.js`
    const geckoName = `${link}.sys.mjs`
    const geckoPath = getArtifactFile(`${folderName}/${geckoName}`)

    if (existsSync(geckoPath)) await rm(geckoPath)
    await symlink(getDistFile(`${folderName}/${distFileName}`), geckoPath)
  }
}

export async function linkStaticFolder(
  folderName: string,
  outFolderName?: string,
  ext = '.sys.mjs',
) {
  const linkFile = await readFile(
    getStaticFile(`${folderName}/link.json`),
    'utf-8',
  )
  const links = JSON.parse(linkFile) as string[]

  for (const link of links) {
    const fileName = `${link}${ext}`
    const geckoPath = getArtifactFile(
      `${outFolderName || folderName}/${fileName}`,
    )
    const srcFile = getStaticFile(`${folderName}/${fileName}`)

    if (existsSync(geckoPath)) await rm(geckoPath)
    if (!existsSync(dirname(geckoPath)))
      await mkdir(dirname(geckoPath), { recursive: true })
    await symlink(srcFile, geckoPath)
  }
}

export async function linkFolder(staticName: string, outputName: string) {
  const staticFolder = getStaticFile(staticName)
  const geckoFolder = getArtifactFile(outputName)

  if (existsSync(geckoFolder)) await rm(geckoFolder, { recursive: true })
  if (!existsSync(dirname(geckoFolder)))
    await mkdir(dirname(geckoFolder), { recursive: true })

  await symlink(staticFolder, geckoFolder)
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { mkdir, readdir, rm, stat, symlink } from 'fs/promises'
import { existsSync } from 'node:fs'
import { dirname } from 'path'

export async function linkContents(from: string, to: string) {
  const folderContents = await readdir(from)

  for (const item of folderContents) {
    const statResult = await stat(`${from}/${item}`)

    if (statResult.isDirectory()) {
      await linkContents(`${from}/${item}`, `${to}/${item}`)
      continue
    }

    if (existsSync(`${to}/${item}`)) await rm(`${to}/${item}`)
    if (!existsSync(dirname(`${to}/${item}`)))
      await mkdir(dirname(`${to}/${item}`), { recursive: true })
    await symlink(`${from}/${item}`, `${to}/${item}`)
  }
}

/**
 * Creates a link for a specific folder
 * @param from The directory to source the link
 * @param to The location to place the link
 */
export async function linkFolder(from: string, to: string) {
  if (existsSync(to)) await rm(to, { recursive: true })
  if (!existsSync(dirname(to))) await mkdir(dirname(to), { recursive: true })

  await symlink(from, to)
}

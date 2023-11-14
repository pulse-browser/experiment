/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import kleur from 'kleur'
import { existsSync } from 'node:fs'
import { readFile, rm, writeFile } from 'node:fs/promises'

import { STORE_PATH, getStoreFile } from './constants.js'
import { failure } from './logging.js'

const dl = await import('nodejs-file-downloader')

const { bold } = kleur
const API_ORIGIN = 'https://api.github.com'

export interface Release {
  id: number
  tag_name: string
  name: string
  assets: Asset[]
}

export interface Asset {
  url: string
  id: number
  name: string
  browser_download_url: string
}

export async function getLatestRelease(
  owner: string,
  repo: string,
): Promise<Release> {
  const url = `${API_ORIGIN}/repos/${owner}/${repo}/releases?per_page=1`
  const [release] = await (await fetch(url)).json()
  return release
}

export async function downloadReleaseAsset(
  release: Release,
  assetName: string,
) {
  const artifactFile = getStoreFile('artifact.tar.bz2')
  const artifactIDFile = getStoreFile('artifact_id.txt')

  const asset = release.assets.find((asset) => asset.name == assetName)
  if (typeof asset == 'undefined') {
    failure(`Could not retrive a release asset matching '${assetName}'`)
  }

  // Check if the artifact exist & matches the current artifact version. If it doesn't match
  // the current artifact, we should remove it.
  if (existsSync(artifactFile)) {
    if (existsSync(artifactIDFile)) {
      const artifactID = await readFile(artifactIDFile, { encoding: 'utf8' })
      if (parseInt(artifactID) == asset.id) return artifactFile
    }

    await rm(artifactFile)
  }

  // Write out a new line so that progress doesn't overwrite exising logs
  process.stdout.write('\n' + asset.browser_download_url)

  let printIndex = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const downloader = new (dl.default as any)({
    url: asset.browser_download_url,
    fileName: 'artifact.tar.bz2',
    directory: STORE_PATH,
    onProgress(percentage: string, _chunk: object, remainingSize: number) {
      printIndex = (printIndex + 1) % 50
      if (printIndex != 0) return

      // Clear the current line & write out the process. This does not work in CI
      if (process.stdout.clearLine) {
        process.stdout.clearLine(0)
        process.stdout.cursorTo(0)
      }
      process.stdout.write(
        `${bold().blue(
          'INFO ',
        )}Downloading artifact: ${percentage}% (${remainingSize} left)`,
      )
    },
  })

  try {
    const { filePath } = await downloader.download()
    if (filePath == null) failure('File downloader failed to save file')

    process.stdout.write('\n')
    await writeFile(artifactIDFile, asset.id.toString())

    return filePath
  } catch (e) {
    failure(e as Error)
  }
}

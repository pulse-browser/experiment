/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * This script is good for finding & downloading artifacts from the runtime repo.
 * As a general rule of thumb it will:
 * 1. Find the most recent artifact
 * 2. Download that artifact
 * 3. Extract it
 * 4. Put it in the correct location & extract the omni.ja file
 */
import { execa } from 'execa'
import { existsSync } from 'fs'
import { mkdir, rm } from 'fs/promises'

import { ARTIFACT_RT_PATH, getArtifactFile, getFile } from './lib/constants.js'
import { setupFiles } from './lib/files.js'
import { linkContents, linkFolder } from './lib/linker.js'
import { failure, info } from './lib/logging.js'
import { downloadReleaseAsset, getLatestRelease } from './lib/releases.js'

const OWNER = 'pulse-browser'
const REPO = 'experiment-runtime'

const ARTIFACT_NAME = 'runtime.linux.tar.bz2'

if (process.platform != 'linux') {
  failure('Artifact builds are only compiled for linux')
}

info('Retriving artifact info...')
const release = await getLatestRelease(OWNER, REPO)
const artifact = await downloadReleaseAsset(release, ARTIFACT_NAME)

// Now for the fun part. We need to unpack everything into the store folder.
// This consists of:
// 1. Clearing out the runtime path
// 2. Extracting the tar file
// 3. Extracting the omnijar
// 4. Overwriting and symlinking the browser chrome folder

if (existsSync(ARTIFACT_RT_PATH)) {
  info('Deleting old runtime directory')
  await rm(ARTIFACT_RT_PATH, { recursive: true, force: true })
}

// The tar file has the application name at the top level, so we need to strip this.
// NOTE: This will not work on macOS without gnutar. May not work on windows
info('Extracting runtime...')
await mkdir(ARTIFACT_RT_PATH, { recursive: true })
await execa('tar', [
  '--strip-components=1',
  '-xf',
  artifact,
  '-C',
  ARTIFACT_RT_PATH,
])

info('Extracting omni.ja...')
const omnijar = getArtifactFile('omni.ja')
await execa('unzip', [omnijar], { cwd: ARTIFACT_RT_PATH })
await rm(omnijar)

info('Setting up symlinks...')
await linkFolder(
  getFile('apps/content/dist'),
  getArtifactFile('chrome/browser/content/browser'),
)
await linkFolder(
  getFile('apps/extensions/lib'),
  getArtifactFile('chrome/browser/content/extensions'),
)

await linkContents(getFile('apps/misc/static'), ARTIFACT_RT_PATH)

await linkContents(getFile('apps/actors/lib'), getArtifactFile('actors'))
await linkContents(getFile('apps/modules/lib'), getArtifactFile('modules'))
await linkFolder(
  getFile('apps/tests/integrations'),
  getArtifactFile('modules/tests/integrations'),
)

info('Setting up files...')
await setupFiles()

info('')
info('You are all set up!')
info('  To start the dev server, run `pnpm dev`')
info('  To launch the app, run `pnpm app:start`')

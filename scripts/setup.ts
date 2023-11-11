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

import { existsSync } from 'fs'
import { mkdir, rm, symlink } from 'fs/promises'
import { execa } from 'execa'

import { downloadReleaseAsset, getLatestRelease } from './lib/releases.js'
import { failure, info } from './lib/logging.js'
import {
  ARTIFACT_RT_PATH,
  getArtifactFile,
  getDistFile,
  getSrcFile,
} from './lib/constants.js'
import { linkFolder } from './lib/linker.js'
import { setupFiles } from './lib/files.js'

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
const contentDir = getArtifactFile('chrome/browser/content/browser')
const contentDirDist = getDistFile('browser_content')
await mkdir(contentDirDist, { recursive: true })
await rm(contentDir, { recursive: true, force: true })
await symlink(contentDirDist, contentDir)

// Link preference file
const prefFile = getArtifactFile('defaults/pref/prefs.js')
const prefFileSrc = getSrcFile('prefs.js')
await rm(prefFile, { recursive: true, force: true })
await symlink(prefFileSrc, prefFile)

await linkFolder('modules')
await linkFolder('actors')

info('Setting up files...')
await setupFiles()

info('')
info('You are all set up!')
info('  To start webpack, run `pnpm dev`')
info('  To launch the app, run `pnpm app:start`')

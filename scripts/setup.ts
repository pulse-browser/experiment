/**
 * This script is good for finding & downloading artifacts from the runtime repo.
 * As a general rule of thumb it will:
 * 1. Find the most recent artifact
 * 2. Download that artifact
 * 3. Extract it
 * 4. Put it in the correct location & extract the omni.ja file
 */

import { existsSync } from 'fs'
import { mkdir, readFile, rm, symlink } from 'fs/promises'
import { execa } from 'execa'

import { downloadReleaseAsset, getLatestRelease } from './lib/releases.js'
import { failure, info } from './lib/logging.js'
import {
  ARTIFACT_RT_PATH,
  getArtifactFile,
  getDistFile,
  getSrcFile,
} from './lib/constants.js'

const OWNER = 'pulse-browser'
const REPO = 'experiment-runtime'

const ARTIFACT_NAME = 'runtime.linux.tar.bz2'

if (process.platform != 'linux') {
  failure('Artifact builds are only compiled for linux')
}

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
await rm(contentDir, { recursive: true, force: true })
await symlink(contentDirDist, contentDir)

// Now we want to link all of the modules to the correct location. Some notes:
// - There is a module index file called `link.json`
// - tsc will output modules in esm using the `.js` file name
const linkFile = await readFile(getSrcFile('modules/link.json'), {
  encoding: 'utf8',
})
const links = JSON.parse(linkFile)
for (const link of links) {
  const webpackFile = `${link}.js`
  const geckoName = `${link}.sys.mjs`
  const geckoPath = getArtifactFile(`modules/${geckoName}`)

  if (existsSync(geckoPath)) await rm(geckoPath)
  await symlink(getDistFile(`modules/${webpackFile}`), geckoPath)
}

info('')
info('You are all set up!')
info('  To start webpack, run `pnpm dev`')
info('  To launch the app, run `pnpm app:start`')

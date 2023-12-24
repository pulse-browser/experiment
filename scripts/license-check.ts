/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { readFileSync } from 'node:fs'
import { argv } from 'node:process'

import { SCRIPTS_PATH, SRC_PATH, STATIC_PATH } from './lib/constants.js'
import { walkDirectory } from './lib/fs.js'
import { autoFix, isValidLicense } from './lib/license.js'
import { failure } from './lib/logging.js'

const IGNORED_FILES = new RegExp(
  '.*\\.(json|patch|md|jpeg|png|gif|tiff|ico|txt)',
)

const shouldFix = argv.includes('--fix')
const filesToCheck = [
  ...(await walkDirectory(SCRIPTS_PATH)),
  ...(await walkDirectory(SRC_PATH)),
  ...(await walkDirectory(STATIC_PATH)),
]

const invalidFiles = filesToCheck
  .filter((file) => !IGNORED_FILES.test(file))
  .filter((file) => !isValidLicense(readFileSync(file, { encoding: 'utf-8' })))

if (!shouldFix && invalidFiles.length == 0) process.exit(0)

if (!shouldFix) {
  failure(
    'The following files did not have a license header:',
    '\n\t' + invalidFiles.join('\n\t'),
  )
}

const attemptedFixes = await Promise.all(
  invalidFiles.map(async (path) => ({ fixed: await autoFix(path), path })),
)
const failedFixes = attemptedFixes.filter(({ fixed }) => !fixed)

if (failedFixes.length != 0) {
  failure(
    "The following files couldn't have a license header added:",
    '\n\t' + failedFixes.map(({ path }) => path).join('\n\t'),
  )
}

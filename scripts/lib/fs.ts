/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { readdir, stat } from 'node:fs/promises'
import { isAbsolute, join } from 'node:path'

import { failure } from './logging.js'

/**
 * Ignores node modules, dist, and .turbo directories
 */
export async function walkDirectory(directory: string): Promise<string[]> {
  const output: string[] = []

  if (!isAbsolute(directory)) {
    failure('Please provide an absolute input to walkDirectory')
  }

  try {
    const directoryContents = await readdir(directory)

    for (const file of directoryContents) {
      if (
        file.includes('node_modules') ||
        file.includes('dist') ||
        file.includes('turbo')
      )
        continue

      const fullPath = join(directory, file)
      const fStat = await stat(fullPath)

      if (fStat.isDirectory()) {
        for (const newFile of await walkDirectory(fullPath)) {
          output.push(newFile)
        }
      } else {
        output.push(fullPath)
      }
    }
  } catch (error) {
    failure<string | Error>('Failed to index directory', error as Error)
  }

  return output
}

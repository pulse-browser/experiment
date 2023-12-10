/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { resolve } from 'path'

const getXFile = (x: string) => (file: string) => resolve(x, file)

export const STORE_PATH = resolve(process.cwd(), '.store/')
export const getStoreFile = getXFile(STORE_PATH)

export const ARTIFACT_RT_PATH = getStoreFile('rt')
export const getArtifactFile = getXFile(ARTIFACT_RT_PATH)

export const DIST_PATH = resolve(process.cwd(), 'dist')
export const getDistFile = getXFile(DIST_PATH)

export const SRC_PATH = resolve(process.cwd(), 'src')
export const getSrcFile = getXFile(SRC_PATH)

export const STATIC_PATH = resolve(process.cwd(), 'static')
export const getStaticFile = getXFile(STATIC_PATH)

export const SCRIPTS_PATH = resolve(process.cwd(), 'scripts')

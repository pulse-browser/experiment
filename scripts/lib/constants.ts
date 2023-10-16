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

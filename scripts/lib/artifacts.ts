import { existsSync } from 'fs'
import { readFile, rm } from 'fs/promises'

const dl = await import('nodejs-file-downloader')

import { STORE_PATH, getStoreFile } from './constants.js'
import { failure } from './logging.js'

const API_ORIGIN = 'https://api.github.com'

export interface Artifact {
  id: number
  name: string
  url: string
  archive_download_url: string
  expired: boolean
}

export async function getLatestArtifacts(
  owner: string,
  repo: string,
  name: string,
): Promise<Artifact> {
  return (await getArtifacts(owner, repo, name))[0]
}

export async function getArtifacts(
  owner: string,
  repo: string,
  name: string,
): Promise<Artifact[]> {
  const url = `${API_ORIGIN}/repos/${owner}/${repo}/actions/artifacts?name=${name}`
  const { artifacts } = await (await fetch(url)).json()
  return artifacts
}

/**
 * Downloads an artifact from Github's server and stores it in a path. If the artifact
 * has already been downloaded, it will use the cached version
 *
 * @param artifact Information about the artifact you want to download
 * @returns A path to the artifact zip file
 */
export async function downloadArtifact(artifact: Artifact): Promise<string> {
  const artifactFile = getStoreFile('artifact.zip')
  const artifactIDFile = getStoreFile('artifact_id.txt')

  // Check if the artifact exist & matches the current artifact version. If it doesn't match
  // the current artifact, we should remove it.
  if (existsSync(artifactFile)) {
    if (existsSync(artifactIDFile)) {
      const artifactID = await readFile(artifactIDFile, { encoding: 'utf8' })
      if (parseInt(artifactID) == artifact.id) return artifactFile
    }

    await rm(artifactFile)
  }

  // Write out a new line so that progress doesn't overwrite exising logs
  console.info(artifact.archive_download_url)

  const downloader = new (dl.default as any)({
    url: 'https://nightly.link/pulse-browser/experiment-runtime/workflows/artifact/main/runtime.linux.tar.bz2.zip',
    fileName: 'artifact.zip',
    directory: STORE_PATH,
    onProgress(percentage: string, _chunk: object, _remainingSize: number) {
      // Clear the current line & write out the process
      process.stdout.clearLine(0)
      process.stdout.cursorTo(0)
      console.log(`Downloading artifact: ${percentage}%`)
    },
  })

  try {
    const { filePath } = await downloader.download()
    if (filePath == null) failure('File downloader failed to save file')

    return filePath
  } catch (e) {
    failure(e)
  }
}

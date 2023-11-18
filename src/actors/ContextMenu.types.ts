/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// NOTE: This file should only have types imported from it. Its contents will not be
// available at runtime

export interface MediaInfo {
  contentType?: string
  contentDisposition?: string
}

export interface ContextMenuInfo {
  position: {
    screenX: number
    screenY: number
    inputSource: number
  }

  context: {
    principal?: nsIPrincipalType
    referrerInfo?: string
  }

  mediaInfo?: MediaInfo

  textSelection?: string
  href?: string
  imageSrc?: string
}

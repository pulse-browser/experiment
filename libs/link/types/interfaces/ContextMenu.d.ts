/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

declare interface ContextMenuMediaInfo {
  contentType?: string
  contentDisposition?: string
}

declare interface ContextMenuInfo {
  position: {
    screenX: number
    screenY: number
    inputSource: number
  }

  context: {
    principal?: nsIPrincipalType
    referrerInfo?: string
  }

  mediaInfo?: ContextMenuMediaInfo

  textSelection?: string
  href?: string
  imageSrc?: string
}

declare type ContextMenuEvent = {
  name: 'contextmenu'
  data: ContextMenuInfo
  target: JSWindowActorParent
}

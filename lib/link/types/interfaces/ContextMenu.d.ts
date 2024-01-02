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

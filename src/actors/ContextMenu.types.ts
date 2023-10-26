// NOTE: This file should only have types imported from it. Its contents will not be
// available at runtime

export interface ContextMenuInfo {
  position: {
    screenX: number
    screenY: number
    inputSource: number
  }

  textSelection?: string
}

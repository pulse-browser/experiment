import { nanoid } from 'nanoid'

export const id = nanoid()

export function getWindowById(wid: string) {
  if (wid === id) return window

  const windows = Services.ww.getWindowEnumerator()
}

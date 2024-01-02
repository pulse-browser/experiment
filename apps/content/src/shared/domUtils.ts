/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { lazy } from '@experiment/shared'

export type ClickModifiers = 'Shift' | 'Alt' | 'Command' | 'Ctrl' | 'MacCtrl'
export const clickModifiersFromEvent = (
  event: MouseEvent,
): ClickModifiers[] => {
  const map = {
    shiftKey: 'Shift',
    altKey: 'Alt',
    metaKey: 'Command',
    ctrlKey: 'Ctrl',
  } as const

  const modifiers: ClickModifiers[] = (Object.keys(map) as (keyof typeof map)[])
    .filter((key) => event[key])
    .map((key) => map[key])

  if (event.ctrlKey && lazy.AppConstants.platform === 'macosx') {
    modifiers.push('MacCtrl')
  }

  return modifiers
}

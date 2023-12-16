/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { readable } from 'svelte/store'

import type { PageAction } from 'resource://app/modules/EPageActions.sys.mjs'

import { resource } from '../resources'

/**
 * @todo lazy loading store
 */
export const pageActions = readable(
  [...resource.EPageActions.pageActions.entries()],
  (set) => {
    const update = () => set([...resource.EPageActions.pageActions.entries()])
    resource.EPageActions.events.on('*', update)
    return () => resource.EPageActions.events.off('*', update)
  },
)

export const pageActionIcons = (pageAction: PageAction) =>
  readable<Record<number, string> | undefined>(pageAction.icons, (set) =>
    pageAction.events.on('updateIcon', set),
  )

export function getIconUrlForPreferredSize(
  icon: Record<number, string>,
  preferredSize: number,
) {
  let bestSize

  if (icon[preferredSize]) {
    bestSize = preferredSize
  } else if (icon[preferredSize * 2]) {
    bestSize = preferredSize * 2
  } else {
    const sizes = Object.keys(icon)
      .map((key) => parseInt(key, 10))
      .sort((a, b) => a - b)
    bestSize =
      sizes.find((candidate) => candidate > preferredSize) || sizes.pop()!
  }

  return icon[bestSize]
}

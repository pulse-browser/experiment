/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { readable } from 'svelte/store'

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

import { readable } from 'svelte/store'

import { resource } from '../resources'

/**
 * @todo lazy loading store
 */
export const pageActions = readable(
  resource.EPageActions.pageActions.entries(),
  (set) => {
    const update = () => set(resource.EPageActions.pageActions.entries())
    resource.EPageActions.events.on('*', update)
    return () => resource.EPageActions.events.off('*', update)
  },
)

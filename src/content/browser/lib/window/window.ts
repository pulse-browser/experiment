import { nanoid } from 'nanoid'

import { resource } from '../resources'

export const id = nanoid()

export const getWindowById = (id: string) =>
  resource.WindowTracker.getWindowById(id)

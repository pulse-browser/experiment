/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import type { Emitter, EventType } from 'mitt'

export const waitForEvent = <
  Events extends Record<EventType, unknown>,
  Key extends keyof Events,
>(
  emitter: Emitter<Events>,
  event: Key,
) =>
  new Promise<Events[Key]>((resolve) => {
    const handler = (value: Events[Key]) => {
      emitter.off(event, handler)
      resolve(value)
    }

    emitter.on(event, handler)
  })

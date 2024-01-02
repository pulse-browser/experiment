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

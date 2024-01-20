export const not =
  <T extends Array<unknown>>(fn: (...args: T) => boolean) =>
  (...args: T) =>
    !fn(...args)

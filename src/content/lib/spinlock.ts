export function sleep(duration: number): Promise<void> {
  return new Promise((res) => setTimeout(res, duration))
}

export async function spinLock(predicate: () => boolean): Promise<void> {
  while (!predicate()) {
    await sleep(1)
  }
}

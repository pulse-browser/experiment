/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export function sleep(duration: number): Promise<void> {
  return new Promise((res) => setTimeout(res, duration))
}

export async function spinLock(predicate: () => boolean): Promise<void> {
  while (!predicate()) {
    await sleep(1)
  }
}

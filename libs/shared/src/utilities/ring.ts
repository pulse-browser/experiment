/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export class Ring<T> {
  private values: T[]
  private index = -1

  constructor(count = 5) {
    this.values = Array(count)
  }

  public next(value: T) {
    this.index += 1
    if (this.index >= this.values.length) this.index = 0
    this.values[this.index] = value
  }

  public prev(): T {
    this.index -= 1
    if (this.index <= -1) this.index = this.values.length - 1
    return this.values[this.index]
  }
}

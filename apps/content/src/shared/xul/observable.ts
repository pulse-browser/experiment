/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export type ObservableCallback = (
  subject: nsISupportsType,
  topic: string,
  data: string,
) => void

class ObservableImpl implements nsIObserverType {
  QueryInterface = ChromeUtils.generateQI(['nsIObserver'])
  observe: ObservableCallback

  constructor(cb: ObservableCallback) {
    this.observe = cb
  }
}

export function observable(callback: ObservableCallback): nsIObserverType {
  return new ObservableImpl(callback)
}

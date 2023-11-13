/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export interface ProviderResult {
  title: string
  icon?: string
  url: nsIURIType
}

export abstract class Provider {
  public abstract getResults(query: string): Promise<ProviderResult[]>
}

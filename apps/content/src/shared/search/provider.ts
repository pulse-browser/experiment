/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * How far in the list the priority should appear
 */
export enum ResultPriority {
  /**
   * The result that should, no matter what, appear at the top of the list.
   * Each provider should only every return a single entry with this result.
   */
  CRITICAL = 0,
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
}

export interface ProviderResult {
  title: string
  icon?: string
  url: string
  priority: ResultPriority
}

export abstract class Provider {
  /**
   * How important is this provider compared to others? The lower the number,
   * the higher the priority. As a rule of thumb:
   *
   * - 0: Nearly guaranteed correct result (if any). e.g. user entered url
   * - 1: Based on user entered data, e.g. bookmarks
   * - 2: Based on user behavior, e.g. history
   * - 3: Based on third party data, e.g. search engines
   */
  public abstract providerPriority: number

  /**
   * Should return results that do not require network queries. Your highest
   * priority results should be returned from this method
   */
  public abstract getFastResults(
    query: string,
  ): Promise<ProviderResult[]> | ProviderResult[]

  public abstract getResults(query: string): Promise<ProviderResult[]>
}

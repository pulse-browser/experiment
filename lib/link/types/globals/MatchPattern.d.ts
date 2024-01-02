/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

interface MatchPatternOptions {
  /**
   * If true, the path portion of the pattern is ignored, and replaced with a
   * wildcard. The `pattern` property is updated to reflect this.
   */
  ignorePath?: boolean

  /**
   * If true, the set of schemes this pattern can match is restricted to
   * those accessible by WebExtensions.
   */
  restrictSchemes?: boolean
}

interface MatchPattern {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  constructor(pattern: string, options?: MatchPatternOptions)

  /**
   * Returns true if the given URI matches the pattern.
   *
   * If explicit is true, only explicit domain matches, without wildcards, are
   * considered.
   */
  matches(uri: URI, explicit?: boolean): boolean
  matches(url: string, explicit?: boolean): boolean

  /**
   * Returns true if a URL exists which a) would be able to access the given
   * cookie, and b) would be matched by this match pattern.
   */
  matchesCookie(cookie: Cookie): boolean

  /**
   * Returns true if this pattern will match any host which would be matched
   * by the given pattern.
   */
  subsumes(pattern: MatchPattern): boolean

  /**
   * Returns true if this pattern will match any host which would be matched
   * by the given pattern, ignoring the scheme.
   */
  subsumesDomain(pattern: MatchPattern): boolean

  /**
   * Returns true if there is any host which would be matched by both this
   * pattern and the given pattern.
   */
  overlaps(pattern: MatchPattern): boolean

  /**
   * The match pattern string represented by this pattern.
   */
  readonly pattern: string

  /**
   * Whether the match pattern matches all http(s) URLs.
   */
  readonly matchesAllWebUrls: boolean
}

class MatchPatternSet {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  constructor(
    patterns: Array<string | MatchPattern>,
    options?: MatchPatternOptions,
  )

  matches(uri: URI, explicit?: boolean): boolean
  matches(url: string, explicit?: boolean): boolean

  matchesCookie(cookie: Cookie): boolean

  subsumes(pattern: MatchPattern): boolean

  subsumesDomain(pattern: MatchPattern): boolean

  overlaps(pattern: MatchPattern): boolean

  overlaps(patternSet: MatchPatternSet): boolean

  overlapsAll(patternSet: MatchPatternSet): boolean

  readonly patterns: Array<MatchPattern>

  readonly matchesAllWebUrls: boolean
}

declare global {
  interface Window {
    MatchPatternSet: typeof MatchPatternSet
  }
}

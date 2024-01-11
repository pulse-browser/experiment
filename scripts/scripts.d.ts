/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

declare module 'tap-spec' {
  import { Transform } from 'stream'

  declare type SpecOptions = {
    padding?: string
  }

  function tapSpec(spec?: SpecOptions): Transform
  export default tapSpec
}

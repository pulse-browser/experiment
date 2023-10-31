/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export let resource: {
  E10SUtils: typeof import('resource://gre/modules/E10SUtils.sys.mjs').E10SUtils
  NetUtil: typeof import('resource://gre/modules/NetUtil.sys.mjs').NetUtil
} = {} as any
;(ChromeUtils as any).defineESModuleGetters(resource, {
  E10SUtils: 'resource://gre/modules/E10SUtils.sys.mjs',
  NetUtil: 'resource://gre/modules/NetUtil.sys.mjs',
})

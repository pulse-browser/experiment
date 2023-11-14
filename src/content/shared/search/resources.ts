/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { lazyESModuleGetters } from '@shared/TypedImportUtilities'

export const searchResources = lazyESModuleGetters({
  AddonSearchEngine: 'resource://gre/modules/AddonSearchEngine.sys.mjs',
  SearchUtils: 'resource://gre/modules/SearchUtils.sys.mjs',
})

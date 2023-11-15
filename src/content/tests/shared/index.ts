/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import contextMenus from './contextMenus'
import search from './search'

export default async function () {
  await contextMenus()
  await search()
}

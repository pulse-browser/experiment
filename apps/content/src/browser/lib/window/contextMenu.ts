/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { writable } from 'svelte/store'

export let contextMenuParentActor: JSWindowActorParent
export const browserContextMenuInfo = writable<ContextMenuInfo>({
  position: { screenX: 0, screenY: 0, inputSource: 0 },
  context: {},
})

export function setContextMenuParentActor(actor: JSWindowActorParent) {
  contextMenuParentActor = actor
}

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

let sidebarItemCounter = 0

export class SidebarItemData {
  counter = sidebarItemCounter++

  container: HTMLDivElement
  title: string
  id: string

  hasObserver = false

  constructor(container: HTMLDivElement, title: string) {
    this.container = container
    this.title = title

    this.id = this.title.replace(/\s/g, '_')
    this.container.setAttribute('id', this.id)
  }

  addObserver(observer: IntersectionObserver | undefined) {
    if (this.hasObserver || !observer) return
    observer.observe(this.container)
    this.hasObserver = true
  }
}

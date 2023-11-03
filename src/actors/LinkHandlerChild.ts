/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/// <reference path="../link.d.ts" />

import { FaviconLoader } from 'resource://app/modules/FaviconLoader.sys.mjs'

declare global {
  interface Document {
    documentURIObject: nsIURIType
  }

  interface HTMLElement {
    ownerGlobal: any
  }
}

type DOMLinkAdded = Event & { target: HTMLLinkElement; type: 'DOMLinkAdded' }
type DOMHeadParsed = Event & {
  target: HTMLHeadElement
  type: 'DOMHeadElementParsed'
}
type PageShow = PageTransitionEvent & { type: 'pageshow' }
type PageHide = PageTransitionEvent & { type: 'pagehide' }

export class LinkHandlerChild extends JSWindowActorChild {
  iconLoader: import('../modules/FaviconLoader.ts').FaviconLoader =
    new FaviconLoader(this) as any
  loadedTabIcon = false

  /**
   * If we haven't already loaded a more specific favicon, we will load the default icon,
   * generally located at `/favicon.ico`, although there is extra logic
   */
  fetchRootFavicon() {
    if (this.loadedTabIcon) return

    const pageURI = this.document.documentURIObject
    if (['http', 'https'].includes(pageURI.scheme)) {
      this.loadedTabIcon = true
      this.iconLoader.addDefaultIcon(pageURI)
    }
  }

  onPageShow(event: PageShow) {
    if (event.target != this.document) return
    this.fetchRootFavicon()
    if (this.iconLoader) this.iconLoader.onPageShow()
  }

  onPageHide(event: PageHide) {
    if (event.target != this.document) return
    if (this.iconLoader) this.iconLoader.onPageHide()
    this.loadedTabIcon = false
  }

  onHeadParsed(event: DOMHeadParsed) {
    if (event.target.ownerDocument != this.document) return
    this.fetchRootFavicon()
    if (this.iconLoader) this.iconLoader.onPageShow()
  }

  onLinkEvent(event: DOMLinkAdded) {
    let link = event.target
    // Ignore sub-frames (bugs 305472, 479408).
    if (link.ownerGlobal != this.contentWindow) {
      return
    }

    let rel = link.rel && link.rel.toLowerCase()
    // We also check .getAttribute, since an empty href attribute will give us
    // a link.href that is the same as the document.
    if (!rel || !link.href || !link.getAttribute('href')) {
      return
    }

    // Note: following booleans only work for the current link, not for the
    // whole content
    let iconAdded = false
    let searchAdded = false
    let rels: Record<string, boolean> = {}
    for (let relString of rel.split(/\s+/)) {
      rels[relString] = true
    }

    for (let relVal in rels) {
      let isRichIcon = false

      switch (relVal) {
        case 'apple-touch-icon':
        case 'apple-touch-icon-precomposed':
        case 'fluid-icon':
          isRichIcon = true
        // fall through
        case 'icon':
          if (iconAdded || link.hasAttribute('mask')) {
            // Masked icons are not supported yet.
            break
          }

          if (!Services.prefs.getBoolPref('browser.chrome.site_icons', true)) {
            return
          }

          if (this.iconLoader.addIconFromLink(link, isRichIcon)) {
            iconAdded = true
            if (!isRichIcon) {
              this.loadedTabIcon = true
            }
          }
          break
        case 'search':
          if (
            Services.policies &&
            !Services.policies.isAllowed('installSearchEngine')
          ) {
            break
          }

          if (!searchAdded && event.type == 'DOMLinkAdded') {
            let type = link.type && link.type.toLowerCase()
            type = type.replace(/^\s+|\s*(?:;.*)?$/g, '')

            // Note: This protocol list should be kept in sync with
            // the one in OpenSearchEngine's install function.
            let re = /^https?:/i
            if (
              type == 'application/opensearchdescription+xml' &&
              link.title &&
              re.test(link.href)
            ) {
              let engine = { title: link.title, href: link.href }
              this.sendAsyncMessage('Link:AddSearch', {
                engine,
              })
              searchAdded = true
            }
          }
          break
      }
    }
  }

  handleEvent(event: PageShow | PageHide | DOMHeadParsed | DOMLinkAdded) {
    switch (event.type) {
      case 'pageshow':
        return this.onPageShow(event)
      case 'pagehide':
        return this.onPageHide(event)
      case 'DOMHeadElementParsed':
        return this.onHeadParsed(event)
      default:
        return this.onLinkEvent(event)
    }
  }
}

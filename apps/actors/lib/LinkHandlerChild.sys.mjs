/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-check
/// <reference types="@browser/link" />
import { FaviconLoader } from 'resource://app/modules/FaviconLoader.sys.mjs'

export class LinkHandlerChild extends JSWindowActorChild {
  iconLoader = new FaviconLoader(this)
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

  /**
   * @param {PageShowEvent} event
   */
  onPageShow(event) {
    if (event.target != this.document) return
    this.fetchRootFavicon()
    if (this.iconLoader) this.iconLoader.onPageShow()
  }

  /**
   * @param {PageHideEvent} event
   */
  onPageHide(event) {
    if (event.target != this.document) return
    if (this.iconLoader) this.iconLoader.onPageHide()
    this.loadedTabIcon = false
  }

  /**
   * @param {DOMHeadParsedEvent} event
   */
  onHeadParsed(event) {
    if (event.target.ownerDocument != this.document) return
    this.fetchRootFavicon()
    if (this.iconLoader) this.iconLoader.onPageShow()
  }

  /**
   * @param {DOMLinkAddedEvent} event
   */
  onLinkEvent(event) {
    const link = event.target
    // Ignore sub-frames (bugs 305472, 479408).
    if (link.ownerGlobal != this.contentWindow) {
      return
    }

    const rel = link.rel && link.rel.toLowerCase()
    // We also check .getAttribute, since an empty href attribute will give us
    // a link.href that is the same as the document.
    if (!rel || !link.href || !link.getAttribute('href')) {
      return
    }

    // Note: following booleans only work for the current link, not for the
    // whole content
    let iconAdded = false
    let searchAdded = false
    /** @type {Record<string, boolean>} */
    const rels = {}
    for (const relString of rel.split(/\s+/)) {
      rels[relString] = true
    }

    for (const relVal in rels) {
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
            const re = /^https?:/i
            if (
              type == 'application/opensearchdescription+xml' &&
              link.title &&
              re.test(link.href)
            ) {
              const engine = { title: link.title, href: link.href }
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

  /**
   * @param {PageShowEvent | PageHideEvent | DOMHeadParsedEvent | DOMLinkAddedEvent} event
   */
  handleEvent(event) {
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

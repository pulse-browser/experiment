/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
// @ts-check
/// <reference types="@browser/link" />
import { lazyESModuleGetters } from 'resource://app/modules/TypedImportUtils.sys.mjs'

const lazy = lazyESModuleGetters({
  SelectionUtils: 'resource://gre/modules/SelectionUtils.sys.mjs',
  E10SUtils: 'resource://gre/modules/E10SUtils.sys.mjs',
})

export class ContextMenuChild extends JSWindowActorChild {
  /**
   * @param {Node} target
   * @returns {string | undefined}
   */
  getHrefIfExists(target) {
    /** @type {HTMLAnchorElement} */
    // @ts-expect-error We cant cast with as, so this is how I am casting :/
    const asAnchor = target
    if (asAnchor.href) {
      return asAnchor.href
    }

    if (target.parentElement) {
      return this.getHrefIfExists(target.parentElement)
    }
  }

  /**
   * @param {Node} target
   * @returns {string | undefined}
   */
  getImageSrcIfExists(target) {
    /** @type {HTMLImageElement} */
    // @ts-expect-error We cant cast with as, so this is how I am casting :/
    const asImg = target
    if (asImg.src) {
      return asImg.src
    }
  }

  /**
   * This code was based on the code from here: https://searchfox.org/mozilla-central/source/browser/actors/ContextMenuChild.sys.mjs#568
   * @param {Node & nsIImageLoadingContentType} target
   */
  getMediaInfo(target) {
    // @ts-expect-error - Ci interfaces are not instanceofable
    if (!(target instanceof Ci.nsIImageLoadingContent && target.currentURI)) {
      return
    }

    /** @type {ContextMenuMediaInfo} */
    const mediaInfo = {}

    try {
      const imageCache = Cc['@mozilla.org/image/tools;1']
        // @ts-expect-error - Cc is not correctly typed yet
        .getService(Ci.imgITools)
        .getImgCacheForDocument(target.ownerDocument)
      // The image cache's notion of where this image is located is
      // the currentURI of the image loading content.
      const props = imageCache.findEntryProperties(
        target.currentURI,
        target.ownerDocument,
      )

      try {
        mediaInfo.contentType = props.get('type', Ci.nsISupportsCString).data
      } catch (e) {
        // Ignore errors
      }

      try {
        mediaInfo.contentDisposition = props.get(
          'content-disposition',
          Ci.nsISupportsCString,
        ).data
      } catch (e) {
        // Ignore errors
      }
    } catch (e) {
      // Ignore errors
    }

    return mediaInfo
  }

  /** @param {Element} target */
  getReferrerInfo(target) {
    /** @type {nsIReferrerInfoType} */
    // @ts-expect-error - Ci interfaces are really poorly typed at the moment
    const referrerInfo = Cc['@mozilla.org/referrer-info;1'].createInstance(
      Ci.nsIReferrerInfo,
    )
    referrerInfo.initWithElement(target)
    return lazy.E10SUtils.serializeReferrerInfo(referrerInfo)
  }

  /**
   * @param {MouseEvent & { inputSource: number; composedTarget?: EventTarget & Node; target?: Node }} event
   */
  handleEvent(event) {
    /** @type {{ position: ContextMenuInfo['position']; context: ContextMenuInfo['context']} & Partial<ContextMenuInfo>} */
    const data = {
      position: {
        screenX: event.screenX,
        screenY: event.screenY,
        inputSource: event.inputSource,
      },

      context: {
        principal:
          (event.target && event.target.ownerDocument?.nodePrincipal) ||
          undefined,
      },
    }

    const selectionInfo = lazy.SelectionUtils.getSelectionDetails(
      this.contentWindow,
      undefined,
    )
    if (selectionInfo.fullText) {
      data.textSelection = selectionInfo.fullText
    }

    if (
      event.composedTarget &&
      event.composedTarget.nodeType === Node.ELEMENT_NODE
    ) {
      /** @type {Element & nsIImageLoadingContentType} */
      // @ts-expect-error - Ci interfaces are a pain
      const node = event.composedTarget

      data.href = this.getHrefIfExists(node)
      data.imageSrc = this.getImageSrcIfExists(node)
      data.mediaInfo = this.getMediaInfo(node)
      data.context.referrerInfo = this.getReferrerInfo(node)
    }

    this.sendAsyncMessage('contextmenu', data)
  }
}

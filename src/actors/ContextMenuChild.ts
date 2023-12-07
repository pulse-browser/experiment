/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
/// <reference path="../link.d.ts" />
import { lazyESModuleGetters } from 'resource://app/modules/TypedImportUtils.sys.mjs'

import type { ContextMenuInfo, MediaInfo } from './ContextMenu.types'

const lazy = lazyESModuleGetters({
  SelectionUtils: 'resource://gre/modules/SelectionUtils.sys.mjs',
  E10SUtils: 'resource://gre/modules/E10SUtils.sys.mjs',
})

export class ContextMenuChild extends JSWindowActorChild {
  getHrefIfExists(target: Node): string | undefined {
    if ((target as HTMLAnchorElement).href) {
      return (target as HTMLAnchorElement).href
    }

    if (target.parentElement) {
      return this.getHrefIfExists(target.parentElement)
    }
  }

  getImageSrcIfExists(target: Node): string | undefined {
    if ((target as HTMLImageElement).src) {
      return (target as HTMLImageElement).src
    }
  }

  /**
   * This code was based on the code from here: https://searchfox.org/mozilla-central/source/browser/actors/ContextMenuChild.sys.mjs#568
   */
  getMediaInfo(target: Node & nsIImageLoadingContentType) {
    // @ts-expect-error - Ci interfaces are not instanceofable
    if (!(target instanceof Ci.nsIImageLoadingContent && target.currentURI)) {
      return
    }

    const mediaInfo: MediaInfo = {}

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

  getReferrerInfo(target: Element) {
    const referrerInfo = Cc['@mozilla.org/referrer-info;1'].createInstance(
      Ci.nsIReferrerInfo,
    ) as nsIReferrerInfoType
    referrerInfo.initWithElement(target)
    return lazy.E10SUtils.serializeReferrerInfo(referrerInfo)
  }

  handleEvent(
    event: MouseEvent & { inputSource: number; composedTarget?: EventTarget },
  ) {
    const data: {
      position: ContextMenuInfo['position']
      context: ContextMenuInfo['context']
    } & Partial<ContextMenuInfo> = {
      position: {
        screenX: event.screenX,
        screenY: event.screenY,
        inputSource: event.inputSource,
      },

      context: {
        principal:
          (event.target &&
            (event.target as Node).ownerDocument?.nodePrincipal) ||
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
      (event.composedTarget as Node).nodeType === Node.ELEMENT_NODE
    ) {
      const node = event.composedTarget as Node

      data.href = this.getHrefIfExists(node)
      data.imageSrc = this.getImageSrcIfExists(node)
      data.mediaInfo = this.getMediaInfo(
        node as Node & nsIImageLoadingContentType,
      )
      data.context.referrerInfo = this.getReferrerInfo(node as Element)
    }

    this.sendAsyncMessage('contextmenu', data satisfies ContextMenuInfo)
  }
}

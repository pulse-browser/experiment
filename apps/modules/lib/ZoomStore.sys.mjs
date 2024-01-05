/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @ts-check
/// <reference types="@browser/link" />
import mitt from 'resource://app/modules/mitt.sys.mjs'

const ZOOM_STORE_FILE = PathUtils.join(PathUtils.profileDir, 'zoomstore.json')

/** @typedef {import("resource://app/modules/ZoomStore.sys.mjs").ZoomStoreInterface} ZoomStoreInterface */

/** @implements {ZoomStoreInterface} */
class ZoomStoreImpl {
  /**
   * @private
   * @type {Map<string, number> | null}
   */
  zoomPages = null

  /** @type {import('resource://app/modules/mitt.sys.mjs').Emitter<import('resource://app/modules/ZoomStore.sys.mjs').ZoomStoreEvents>} */
  events = mitt()

  constructor() {
    this.init()
  }

  /** @protected */
  async init() {
    if (this.zoomPages) {
      return
    }

    if (!(await IOUtils.exists(ZOOM_STORE_FILE))) {
      this.zoomPages = new Map()
      return
    }

    try {
      const pages = await IOUtils.readJSON(ZOOM_STORE_FILE)
      if (this.zoomPages) {
        return
      }

      this.zoomPages = new Map(pages)
    } catch (e) {
      console.error('Failed to load zoomStore from file: ', e)
      return
    }
  }

  /** @private */
  async save() {
    if (!this.zoomPages) {
      return
    }

    const toWrite = Array.from(this.zoomPages.entries())
    try {
      await IOUtils.writeJSON(ZOOM_STORE_FILE, toWrite)
    } catch (e) {
      console.error('Failed to write zoomStore to file:', e)
      return
    }
  }

  /**
   * @param {nsIURIType} uri The uri to check zoom for
   * @returns {number}
   */
  getZoomForUri(uri) {
    return this.zoomPages?.get(uri.asciiHost) || 1
  }

  /**
   * @param {nsIURIType} uri
   * @param {number} zoom The zoom to store. If set to 1, will delete any stored values
   */
  setZoomForUri(uri, zoom) {
    try {
      uri.host
    } catch {
      return
    }

    if (zoom === 1) {
      this.zoomPages?.delete(uri.host)
      this.events.emit('setZoom', { host: uri.host, zoom })
      return
    }

    this.zoomPages?.set(uri.host, Math.round(zoom * 100) / 100)

    // @ts-ignore
    Services.tm.dispatchToMainThread(() => {
      this.events.emit('setZoom', { host: uri.host, zoom })
      this.save()
    })
  }
}

export const ZoomStore = new ZoomStoreImpl()

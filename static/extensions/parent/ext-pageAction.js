/* eslint-disable no-undef */
// @ts-check
/// <reference path="../types/index.d.ts" />

this.pageAction = class extends ExtensionAPIPersistent {
  async onManifestEntry(entryName) {
    const { extension } = this
    const options = extension.manifest.page_action

    console.log(entryName, options)
  }
}

// global.pageActionFor = this.pageAction.for

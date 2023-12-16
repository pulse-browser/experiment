/* eslint-disable no-undef */
// @ts-check
/// <reference path="../types/index.d.ts" />

/** @type {typeof import('resource://app/modules/TypedImportUtils.sys.mjs')} */
const typedImportUtils = ChromeUtils.importESModule(
  'resource://app/modules/TypedImportUtils.sys.mjs',
)
const { lazyESModuleGetters } = typedImportUtils

const lazy = lazyESModuleGetters({
  EPageActions: 'resource://app/modules/EPageActions.sys.mjs',
  ExtensionParent: 'resource://gre/modules/ExtensionParent.sys.mjs',
})

this.pageAction = class extends ExtensionAPIPersistent {
  async onManifestEntry(entryName) {
    const { extension } = this
    const options = extension.manifest.page_action

    console.log(entryName, options, extension)

    const pageAction = new lazy.EPageActions.PageAction({
      tooltip: options.default_title,
      popupUrl: options.default_popup,
      showMatches: options.show_matches,
      hideMatches: options.hide_matches,
    })

    pageAction.setIcons(
      lazy.ExtensionParent.IconDetails.normalize(
        {
          path: options.default_icon || extension.manifest.icons,
          iconType: 'browserAction',
          themeIcon: options.theme_icons || extension.theme_icons,
        },
        extension,
      ),
    )

    lazy.EPageActions.registerPageAction(extension.id, pageAction)
  }

  onShutdown() {
    const { extension } = this
    lazy.EPageActions.removePageAction(extension.id)
  }
}

// global.pageActionFor = this.pageAction.for

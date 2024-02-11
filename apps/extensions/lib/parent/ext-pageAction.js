/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @ts-check
/// <reference path="../types/index.d.ts" />
/// <reference path="./ext-browser.js" />

this.pageAction = class extends ExtensionAPIPersistent {
  /** @type {import('resource://app/modules/EPageActions.sys.mjs').PageAction | null} */
  pageAction = null

  async onManifestEntry() {
    const { extension } = this
    const options = extension.manifest.page_action

    this.pageAction = new lazy.EPageActions.PageAction({
      extensionId: extension.id,
      tooltip: options.default_title,
      popupUrl: options.default_popup,
      showMatches: options.show_matches,
      hideMatches: options.hide_matches,
    })
    this.pageAction.events.on('click', (v) => this.emit('click', v))
    this.pageAction.setIcons(
      lazy.ExtensionParent.IconDetails.normalize(
        {
          path: options.default_icon || extension.manifest.icons,
          iconType: 'browserAction',
          themeIcon: options.theme_icons || extension.theme_icons,
        },
        extension,
      ),
    )

    lazy.EPageActions.registerPageAction(extension.id, this.pageAction)
  }

  onShutdown() {
    const { extension } = this
    lazy.EPageActions.removePageAction(extension.id)
  }

  PERSISTENT_EVENTS = {
    /**
     * @param {object}             options
     * @param {object}             options.fire
     * @param {function}           options.fire.async
     * @param {function}           options.fire.sync
     * @param {function}           options.fire.raw
     *        For primed listeners `fire.async`/`fire.sync`/`fire.raw` will
     *        collect the pending events to be send to the background context
     *        and implicitly wake up the background context (Event Page or
     *        Background Service Worker), or forward the event right away if
     *        the background context is running.
     * @param {function}           [options.fire.wakeup = undefined]
     *        For primed listeners, the `fire` object also provide a `wakeup` method
     *        which can be used by the primed listener to explicitly `wakeup` the
     *        background context (Event Page or Background Service Worker) and wait for
     *        it to be running (by awaiting on the Promise returned by wakeup to be
     *        resolved).
     * @param {ProxyContextParent} [options.context=undefined]
     *        This property is expected to be undefined for primed listeners (which
     *        are created while the background extension context does not exist) and
     *        to be set to a ProxyContextParent instance (the same got by the getAPI
     *        method) when the method is called for a listener registered by a
     *        running extension context.
     */
    onClicked({ fire }) {
      const callback = async (_name, clickInfo) => {
        if (fire.wakeup) await fire.wakeup()
        fire.sync(clickInfo)
      }

      this.on('click', callback)
      return {
        unregister: () => {
          this.off('click', callback)
        },
        convert(newFire) {
          fire = newFire
        },
      }
    },
  }

  getAPI(context) {
    return {
      pageAction: {
        show: (id) => this.pageAction?.addShow(id),
        hide: (id) => this.pageAction?.addHide(id),

        onClicked: new EventManager({
          context,
          module: 'pageAction',
          event: 'onClicked',
          inputHandling: true,
          extensionApi: this,
        }).api(),
      },
    }
  }
}

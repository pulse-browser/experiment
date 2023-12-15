<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type { PageAction } from 'resource://app/modules/EPageActions.sys.mjs'
  import ToolbarButton from '@shared/components/ToolbarButton.svelte'
  import {
    createBrowser,
    getBrowserRemoteType,
    setURI,
  } from '@browser/lib/xul/browser'
  import { resource } from '@browser/lib/resources'
  import { spinLock } from '@browser/lib/spinlock'
  import { MessageReviver } from '@shared/xul/messageReciver'
  import { onMount } from 'svelte'

  export let pageAction: PageAction

  let panel: any
  let browser: XULBrowserElement
  let button: HTMLButtonElement

  const messageReceiver = new MessageReviver(({ name, data }) => {
    switch (name) {
      case 'Extension:BrowserResized':
        const { width, height } = data as { height: number; width: number }
        browser.style.width = `${width}px`
        browser.style.height = `${height}px`
        break
    }
  })

  async function buildPanelBrowser() {
    if (browser) {
      browser.remove()
    }

    console.log(pageAction.popupUrl)
    if (!pageAction.popupUrl) return
    const uri = resource.NetUtil.newURI(pageAction.popupUrl)

    const lBrowser = createBrowser({
      remoteType: getBrowserRemoteType(uri),
      attributes: {
        disableglobalhistory: 'true',
        messagemanagergroup: 'todo',
        'webextension-view-type': 'popup',
      },
    })

    lBrowser.addEventListener('DidChangeBrowserRemoteness', () =>
      console.log('ChangeRemoteness'),
    )

    await spinLock(() => panel)
    panel.appendChild(lBrowser)
    browser = lBrowser

    lBrowser.messageManager.addMessageListener(
      'Extension:BrowserResized',
      messageReceiver,
    )

    lBrowser.messageManager.loadFrameScript(
      'chrome://extensions/content/ext-browser-content.js',
      false,
      true,
    )

    lBrowser.messageManager.sendAsyncMessage('Extension:InitBrowser', {
      allowScriptsToClose: true,
      maxWidth: 800,
      maxHeight: 600,
    })
    lBrowser.style.borderRadius = 'inherit'

    await spinLock(() => lBrowser.mInitialized)
    setURI(lBrowser, uri)
  }

  const OPEN_PANEL = async () => {
    await buildPanelBrowser()
    panel.openPopup(button, 'bottomright topright')
  }

  onMount(() => () => {
    if (browser) {
      browser.messageManager.removeMessageListener(
        'Extension:BrowserResized',
        messageReceiver,
      )
      browser.remove()
    }
  })
</script>

<ToolbarButton kind="page-icon" bind:button on:click={OPEN_PANEL}>
  <i class="ri-puzzle-line"></i>
</ToolbarButton>

{#if pageAction.popupUrl}
  <xul:panel bind:this={panel} class="popup"></xul:panel>
{/if}

<style>
  .popup {
    --panel-shadow-margin: 0;
    --panel-padding: 0;
    --panel-border-radius: 0.5rem;
  }
</style>

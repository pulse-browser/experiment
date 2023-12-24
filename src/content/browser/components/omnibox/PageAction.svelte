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
  import {
    getIconUrlForPreferredSize,
    pageActionIcons,
  } from '@browser/lib/modules/EPageActionsBindings'
  import { clickModifiersFromEvent } from '@shared/domUtils'

  export let pageAction: PageAction
  const icons = pageActionIcons(pageAction)

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

  function setupBrowser(browser) {
    browser.messageManager.addMessageListener(
      'Extension:BrowserResized',
      messageReceiver,
    )

    browser.messageManager.loadFrameScript(
      'chrome://extensions/content/ext-browser-content.js',
      false,
      true,
    )

    browser.messageManager.sendAsyncMessage('Extension:InitBrowser', {
      allowScriptsToClose: true,
      maxWidth: 800,
      maxHeight: 600,
    })
  }

  async function buildPanelBrowser() {
    if (browser) {
      browser.remove()
    }

    if (!pageAction.popupUrl) return
    const uri = resource.NetUtil.newURI(pageAction.popupUrl)

    const lBrowser = createBrowser({
      remoteType: getBrowserRemoteType(uri),
      attributes: {
        disableglobalhistory: 'true',
        messagemanagergroup: 'webext-browsers',
        'webextension-view-type': 'popup',
      },
    })

    await spinLock(() => panel)
    panel.appendChild(lBrowser)
    browser = lBrowser

    lBrowser.style.borderRadius = 'inherit'
    setupBrowser(lBrowser)
    lBrowser.addEventListener('DidChangeBrowserRemoteness', () =>
      setupBrowser(lBrowser),
    )

    await spinLock(() => lBrowser.mInitialized)
    setURI(lBrowser, uri)
  }

  const handleClick = async (event: MouseEvent) => {
    // Send the event to the extension
    pageAction.events.emit('click', {
      clickData: {
        modifiers: clickModifiersFromEvent(event),
        button: event.button,
      },
    })

    await buildPanelBrowser()
    // Panel may not exist if there is no popupUrl
    if (panel) panel.openPopup(button, 'bottomright topright')
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

<ToolbarButton
  kind="page-icon"
  bind:button
  on:click={handleClick}
  tooltip={pageAction.tooltip}
>
  {#if $icons}
    <img
      src={getIconUrlForPreferredSize($icons, 16)}
      alt="Page action icon"
      class="icon"
    />
  {:else}
    <i class="ri-puzzle-line icon"></i>
  {/if}
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

  .icon {
    width: 1em;
    height: 1em;

    color: var(--text);

    /* This is firefox's dark mode filter
       TODO: When we have themes, toggle this correctly */
    filter: grayscale(100%) brightness(20%) invert();
  }
</style>

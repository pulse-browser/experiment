<script>
  // @ts-check
  import { onMount } from 'svelte'

  import {
    RiRefreshLine,
    RiArrowLeftLine,
    RiArrowRightLine,
  } from 'svelte-remixicon'

  import * as WebsiteViewApi from '../windowApi/WebsiteView'
  import ToolbarButton from './ToolbarButton.svelte'
  import ToolbarSpacer from './ToolbarSpacer.svelte'

  /** @type {WebsiteView} */
  export let view
  /** @type {HTMLDivElement} */
  let browserContainer

  const canGoBack = WebsiteViewApi.locationProperty(
    view,
    (browser) => browser.canGoBack,
    false,
  )
  const canGoForward = WebsiteViewApi.locationProperty(
    view,
    (browser) => browser.canGoForward,
    false,
  )

  const uri = WebsiteViewApi.locationProperty(
    view,
    (_, event) => event.aLocation,
    view.browser.browsingContext?.currentURI,
  )

  $: scheme = $uri?.scheme
  $: host = $uri?.host.startsWith('www.')
    ? $uri.host.replace('www.', '')
    : $uri?.host
  $: port = $uri?.port
  $: file = $uri?.filePath

  $: console.log(scheme, host, port, file)

  onMount(() => browserContainer.append(view.browser))
</script>

<div class="toolbar">
  <ToolbarButton on:click={() => view.browser.goBack()} disabled={!$canGoBack}>
    <RiArrowLeftLine />
  </ToolbarButton>
  <ToolbarButton on:click={() => view.browser.reload()}>
    <RiRefreshLine />
  </ToolbarButton>
  <ToolbarButton
    on:click={() => view.browser.goForward()}
    disabled={!$canGoForward}
  >
    <RiArrowRightLine />
  </ToolbarButton>

  <ToolbarSpacer />

  <div class="url">
    <span class="scheme">{scheme}://</span><span class="host">{host}</span
    >{#if port != -1}<span class="port">:{port}</span
      >{/if}{#if file != '/'}<span class="file">{file}</span>{/if}
  </div>

  <ToolbarSpacer />
</div>

<div bind:this={browserContainer} class="browserContainer"></div>

<style>
  .url .scheme,
  .url .port,
  .url .file {
    color: gray;
  }

  .toolbar {
    display: flex;
    align-items: center;
  }

  .browserContainer {
    display: grid;
    flex-grow: 1;
  }

  .browserContainer :global(browser) {
    grid-area: 1/1;
  }
</style>

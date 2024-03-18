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

  const uri = WebsiteViewApi.locationProperty(view, (_, event) => event.aLocation.spec, '')
  const canGoBack = WebsiteViewApi.locationProperty(view, (browser) => browser.canGoBack, false)
  const canGoForward = WebsiteViewApi.locationProperty(view, (browser) => browser.canGoForward, false)

  onMount(() => 
    browserContainer.append(view.browser)
  )
</script>

<div class="toolbar">
  <ToolbarButton on:click={() => view.browser.goBack()} disabled={!$canGoBack}>
    <RiArrowLeftLine />
  </ToolbarButton>
  <ToolbarButton on:click={() => view.browser.reload()}>
    <RiRefreshLine />
  </ToolbarButton>
  <ToolbarButton on:click={() => view.browser.goForward()} disabled={!$canGoForward}>
    <RiArrowRightLine />
  </ToolbarButton>

  <ToolbarSpacer />

  <div>{$uri}</div>

  <ToolbarSpacer />
</div>

<div bind:this={browserContainer} class="browserContainer"></div>

<style>
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

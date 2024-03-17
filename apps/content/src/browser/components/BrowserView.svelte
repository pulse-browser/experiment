<script>
  // @ts-check
  import { onMount } from 'svelte'

  import {
    RiRefreshLine,
    RiArrowLeftLine,
    RiArrowRightLine,
  } from 'svelte-remixicon'

  import * as WebsiteViewApi from '../windowApi/WebsiteView'
  import { browserImports } from '../browserImports.js'
  import ToolbarButton from './ToolbarButton.svelte'
  import ToolbarSpacer from './ToolbarSpacer.svelte'

  /** @type {WebsiteView} */
  export let browserView
  /** @type {HTMLDivElement} */
  let browserContainer

  const uri = WebsiteViewApi.urlState(browserView)

  onMount(() => 
    browserContainer.append(browserView.browser)
  )
</script>

<div class="toolbar">
  <ToolbarButton on:click={() => browserView.browser.goBack()}>
    <RiArrowLeftLine />
  </ToolbarButton>
  <ToolbarButton on:click={() => browserView.browser.reload()}>
    <RiRefreshLine />
  </ToolbarButton>
  <ToolbarButton on:click={() => browserView.browser.goForward()}>
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

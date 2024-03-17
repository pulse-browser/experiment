<script>
  // @ts-check
  import { onMount } from 'svelte'

  import * as WebsiteViewApi from '../windowApi/WebsiteView'
  import { browserImports } from '../browserImports.js'

  /** @type {WebsiteView} */
  export let browserView
  let browserContainer

  onMount(() => {
    browserContainer.append(browserView.browser)
    WebsiteViewApi.goTo(
      browserView,
      browserImports.NetUtil.newURI('https://google.com/'),
    )
  })
</script>

<div bind:this={browserContainer} class="browserContainer"></div>

<style>
  .browserContainer {
    height: 100%;
    display: grid;
  }

  .browserContainer :global(browser) {
    grid-area: 1/1;
  }
</style>

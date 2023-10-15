<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import {
    createBrowser,
    getBrowserRemoteType,
    setURI,
  } from '../lib/xul/browser'
  import { domContentLoaded } from '../lib/xul/domevents'

  export let url: nsIURIType

  let browserContainer: HTMLElement

  // Put everything here that needs to run **BEFORE** the browser is added
  // to the dom
  let browser: HTMLElement = createBrowser({
    remoteType: getBrowserRemoteType(url),
  })

  onMount(async () => {
    browserContainer.appendChild(browser)
    await domContentLoaded.promise
    setURI(browser, url)
  })

  onDestroy(() => {
    browser.remove()
  })

  // $: loadUrl(url)
</script>

<div bind:this={browserContainer} />

<style>
  :global(browser) {
    width: 100%;
    height: 300px;
  }
</style>

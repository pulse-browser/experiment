<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import {
    createBrowser,
    getBrowserRemoteType,
    setURI,
  } from '../lib/xul/browser'

  export let url: nsIURIType
  let firstLoad = true

  let browserContainer: HTMLElement

  // Put everything here that needs to run **BEFORE** the browser is added
  // to the dom
  let browser: HTMLElement = createBrowser({
    remoteType: getBrowserRemoteType(url),
  })

  // TODO: Should we ensure this is delayed until onDOMContentLoaded() or eq
  onMount(() => {
    browserContainer.appendChild(browser)

    setURI(browser, url)
    if (firstLoad) {
      setTimeout(() => setURI(browser, url), 10)
    }

    //  let oa = resource.E10SUtils.predictOriginAttributes({ browser })
    //  const { useRemoteTabs } = window.docShell.QueryInterface(Ci.nsILoadContext)
    //  const remoteType = resource.E10SUtils.getRemoteTypeForURI(
    //    url.spec,
    //    useRemoteTabs /* is multi process browser */,
    //    false /* fission */,
    //    resource.E10SUtils.DEFAULT_REMOTE_TYPE,
    //    null,
    //    oa
    //  )
    //  browser.setAttribute('remoteType', remoteType)
  })

  function loadUrl(url: string) {
    console.log('load', url)
    let loadURIOptions: Record<string, string> = {}
    if (!loadURIOptions.triggeringPrincipal)
      loadURIOptions.triggeringPrincipal =
        Services.scriptSecurityManager.getSystemPrincipal()

    if (!browser) {
      console.warn(`goto was called before the browser with id was initialized`)
      return
    }

    ;(browser as any).loadURI(url, loadURIOptions)
  }

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

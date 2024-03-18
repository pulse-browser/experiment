<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script>
    import { writable } from 'svelte/store'

  // @ts-check
  import * as WebsiteViewApi from '../windowApi/WebsiteView'
  import * as UrlBoxApi from './urlBox'

  /** @type {WebsiteView} */
  export let view

  const value = writable('')

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

  $: fastAutocomplete = UrlBoxApi.getFastAutocomplete($value)
  $: slowAutocomplete = UrlBoxApi.debouncedSlowAutocomplete(value)
</script>

<div>
  <div class="display">
    <span class="scheme">{scheme}://</span><span class="host">{host}</span
    >{#if port != -1}<span class="port">:{port}</span
      >{/if}{#if file != '/'}<span class="file">{file}</span>{/if}
  </div>

  <div class="input">
    <input type="text" bind:value={$value} />

    <div>
      {#each fastAutocomplete as result}
        <div>{result.url}: {result.display}</div>
      {/each}
      {#each $slowAutocomplete as result}
        <div>{result.url}: {result.display}</div>
      {/each}
    </div>
  </div>
</div>

<style>
  .display .scheme,
  .display .port,
  .display .file {
    color: gray;
  }
</style>

<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script>

  // @ts-check
    import { writable } from 'svelte/store'

  import * as WebsiteViewApi from '../windowApi/WebsiteView'
  import * as UrlBoxApi from './urlBox'
    import { onMount } from 'svelte'

  /** @type {WebsiteView} */
  export let view

  let inputFocused = false

  const uri = WebsiteViewApi.locationProperty(
    view,
    (_, event) => event.aLocation,
    view.browser.browsingContext?.currentURI,
  )

  /** @type {HTMLInputElement} */
  let input
  const value = writable('')

  uri.subscribe(newValue => value.set(newValue?.spec || ''))

  $: fastAutocomplete = UrlBoxApi.getFastAutocomplete($value)
  $: slowAutocomplete = UrlBoxApi.debouncedSlowAutocomplete(value)

  onMount(() => {
  uri.subscribe(UrlBoxApi.performCursedUrlStyling(input))
  })
</script>

<div class="url-box">
    <input type="text" bind:this={input} bind:value={$value} on:focus={() => inputFocused = true} on:blur={() => inputFocused = false} />

    <div hidden={!inputFocused}>
      {#each fastAutocomplete as result}
        <div>{result.url}: {result.display}</div>
      {/each}
      <div>Suggestions</div>
      {#each $slowAutocomplete as result}
        <div>{result.url}: {result.display}</div>
      {/each}
    </div>
</div>

<style>
.url-box {
  flex-grow: 2;
}

.url-box input {
  width: 100%;
}
</style>

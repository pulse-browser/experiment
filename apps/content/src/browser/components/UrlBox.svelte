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

  uri.subscribe((newValue) => value.set(newValue?.spec || ''))

  $: fastAutocomplete = UrlBoxApi.getFastAutocomplete($value)
  $: slowAutocomplete = UrlBoxApi.debouncedSlowAutocomplete(value)

  onMount(() => {
    uri.subscribe(UrlBoxApi.performCursedUrlStyling(input))
  })
</script>

<div class="url-box">
  <div class="background"></div>

  <div class="container" data-active={inputFocused}>
    <input
      type="text"
      bind:this={input}
      bind:value={$value}
      on:focus={() => (inputFocused = true)}
      on:blur={() => (inputFocused = false)}
    />

    <div hidden={!inputFocused} class="completions">
      {#each fastAutocomplete as result}
        <div class="completion">{result.display}</div>
      {/each}
      <div>Suggestions</div>
      {#each $slowAutocomplete as result}
        <div class="completion">{result.display}</div>
      {/each}
    </div>
  </div>
</div>

<style>
  .url-box {
    flex-grow: 2;
    position: relative;
  }

  .url-box:has(+ .container > input:focus) {
    outline: solid;
  }

  input:focus {
    outline: none;
  }

  .background {
    background: black;
    height: 2.5rem;
    border-radius: 1rem;
  }

  .container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    box-sizing: content-box;
    border-radius: 1rem;
  }

  .container[data-active='true'] {
    background: black;
    border: 1px solid red;
  }

  .url-box input {
    width: 100%;
    height: 2.5rem;

    border: none;
    background: none;
    padding: 0 1rem;
    margin: 0;
  }

  .completions {
    padding: 0.5rem;
  }

  .completion {
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    margin-top: 0.5rem;

    background: darkgray;
  }
</style>

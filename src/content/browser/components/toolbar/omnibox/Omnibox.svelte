<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import { onMount } from 'svelte'
  import { resource } from '../../../lib/resources'
  import type { Tab } from '../../tabs/tab'
  import Bookmarks from './Bookmarks.svelte'

  export let tab: Tab

  let inputContent: string = ''
  let inputElement: HTMLInputElement

  $: uri = tab.uri

  const unbindedSetInputContent = (value: string) => {
    inputContent = value
    if (tab.tabJustOpened && inputElement) {
      inputElement.focus()
      inputElement.select()
      tab.tabJustOpened = false
    }
  }
  $: unbindedSetInputContent($uri.asciiSpec)
</script>

<div class="omnibox">
  <input
    class="toolbar__urlbar"
    type="text"
    bind:this={inputElement}
    bind:value={inputContent}
    on:keydown={(e) => {
      if (e.key === 'Enter') tab.goToUri(resource.NetUtil.newURI(inputContent))
    }}
  />

  <Bookmarks {tab} />
</div>

<style>
  * {
    border: none;
    background: none;
  }

  .omnibox {
    flex-grow: 1;
    display: flex;
  }

  .toolbar__urlbar {
    flex-grow: 1;
    border-radius: 0.5rem;
    height: 2.5rem;
    padding: 0 1rem;
    background: var(--base);
  }

  .toolbar__urlbar:focus {
    outline: solid var(--active-border);
  }
</style>

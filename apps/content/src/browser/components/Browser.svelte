<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  import { Tab } from '@browser/lib/window/tab'

  export let tab: Tab
  export let selectedTab: number

  let browserContainer: HTMLElement
  const dispatch = createEventDispatcher()

  onMount(async () => {
    tab.setContainer(browserContainer)
    dispatch('constructed')
  })
  onDestroy(() => tab.destroy())

  $: findbar = tab.findbar
  $: $findbar && tab.setupFindbar(browserContainer, $findbar)
</script>

<div
  bind:this={browserContainer}
  class="browser-container"
  hidden={selectedTab != tab.getId()}
/>

<style>
  .browser-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .browser-container[hidden] {
    display: none;
  }

  .browser-container :global(browser) {
    flex-grow: 1;
    color-scheme: env(-moz-content-preferred-color-scheme);
  }
</style>

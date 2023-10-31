<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  import { Tab } from './tabs/tab'

  export let tab: Tab
  export let selectedTab: number

  let browserContainer: HTMLElement
  const dispatch = createEventDispatcher()

  onMount(async () => {
    tab.setContainer(browserContainer)
    dispatch('constructed')
  })
  onDestroy(() => tab.destroy())
</script>

<div
  bind:this={browserContainer}
  class="browser-container"
  hidden={selectedTab != tab.getId()}
/>

<style>
  .browser-container {
    height: 100%;
  }

  :global(browser) {
    width: 100%;
    height: 100%;
  }
</style>

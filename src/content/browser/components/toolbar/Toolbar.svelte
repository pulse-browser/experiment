<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type { Tab } from '../tabs/tab'
  import HamburgerMenu from './HamburgerMenu.svelte'
  import ToolbarButton from './ToolbarButton.svelte'
  import Omnibox from './omnibox/Omnibox.svelte'

  export let tab: Tab

  $: canGoBack = tab.canGoBack
  $: canGoForward = tab.canGoForward
</script>

<div class="toolbar">
  <ToolbarButton disabled={!$canGoBack} on:click={() => tab.goBack()}>
    <i class="ri-arrow-left-line" />
  </ToolbarButton>
  <ToolbarButton on:click={() => tab.reload()}>
    <i class="ri-refresh-line" />
  </ToolbarButton>
  <ToolbarButton disabled={!$canGoForward} on:click={() => tab.goForward()}>
    <i class="ri-arrow-right-line" />
  </ToolbarButton>

  <div class="toolbar__spacer" />

  <Omnibox {tab} />

  <div class="toolbar__spacer" />

  <HamburgerMenu />
</div>

<style>
  .toolbar {
    display: flex;
    align-items: start;

    background: var(--surface);
    padding: 0.125rem 0.25rem;
  }

  .toolbar * {
    border: none;
    background: none;
  }

  .toolbar__spacer {
    flex-grow: 1;
  }
</style>

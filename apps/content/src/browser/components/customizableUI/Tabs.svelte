<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type {
    Component,
    ComponentId,
    TabsComponent,
  } from '@shared/customizableUI'
  import Tab from '@browser/components/tabs/Tab.svelte'

  import UiItemBase from './UIItemBase.svelte'
  import { openTab, selectedTabId, tabs } from '@browser/lib/window/tabs'
  import ToolbarButton from '@shared/components/ToolbarButton.svelte'
  import { onMount } from 'svelte'

  export let component: ComponentId & TabsComponent
  export let root: Component

  let overflow = false
  let arrowBox: HTMLElement

  onMount(() => {
    arrowBox.addEventListener('overflow', () => (overflow = true))
    arrowBox.addEventListener('underflow', () => (overflow = false))
  })
</script>

<UiItemBase {component} {root} class="tabs" on:drop={(e) => e.preventDefault()}>
  <xul:arrowscrollbox
    bind:this={arrowBox}
    class="tab-container"
    orient="horizontal"
    clicktoscroll="true"
  >
    {#each $tabs as tab (tab.getId())}
      <Tab {tab} bind:selectedTab={$selectedTabId} />
    {/each}

    {#if !overflow}
      <ToolbarButton on:click={() => openTab()}>
        <i class="ri-add-line" />
      </ToolbarButton>
    {/if}
  </xul:arrowscrollbox>

  {#if overflow}
    <ToolbarButton on:click={() => openTab()}>
      <i class="ri-add-line" />
    </ToolbarButton>
  {/if}
</UiItemBase>

<style>
  :global(.component.tabs) {
    --tab-max-width: 16rem;
    --tab-min-width: 4rem;

    display: flex;
    flex-grow: 1;
    gap: 0.125rem;

    overflow: hidden;
  }

  :global(.component.tabs .toolbar__button) {
    margin: 0.25rem 0;
  }

  .tab-container {
    display: flex;
    flex-grow: 1;
    flex-wrap: nowrap;
    align-items: center;

    overflow-x: hidden;
  }
</style>

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
  import { selectedTabId, tabs } from '@browser/lib/window/tabs'

  export let component: ComponentId & TabsComponent
  export let root: Component
</script>

<UiItemBase {component} {root} class="tabs" on:drop={(e) => e.preventDefault()}>
  {#each $tabs as tab (tab.getId())}
    <Tab {tab} bind:selectedTab={$selectedTabId} />
  {/each}
</UiItemBase>

<style>
  :global(.component.tabs) {
    overflow: scroll;
  }
</style>

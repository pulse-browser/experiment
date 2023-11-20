<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type {
    Component,
    ComponentId,
    TabsComponent,
  } from '@shared/customizableUI'
  import { tabs, selectedTab } from '@browser/lib/globalApi'
  import Tab from '@browser/components/tabs/Tab.svelte'

  import UiItemBase from './UIItemBase.svelte'

  export let component: ComponentId & TabsComponent
  export let root: Component
</script>

<UiItemBase {component} {root} class="tabs" on:drop={(e) => e.preventDefault()}>
  {#each $tabs as tab}
    <Tab {tab} bind:selectedTab={$selectedTab} />
  {/each}
</UiItemBase>

<style>
  :global(.component.tabs) {
    display: flex;
    gap: 0.25;
    overflow: scroll;
  }
</style>

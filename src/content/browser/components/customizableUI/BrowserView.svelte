<script lang="ts">
  import type {
    BrowserComponent,
    Component,
    ComponentId,
  } from '@shared/customizableUI'
  import UiItemBase from './UIItemBase.svelte'
  import { selectedTab, tabs } from '../../lib/globalApi'
  import Browser from '../Browser.svelte'

  export let component: ComponentId & BrowserComponent
  export let root: Component

  // We don't care about the order that browers are rendered in the dom, but we
  // want to allow tab reordering. This should stop unnessisary updates
  $: sortedBrowers = [...$tabs].sort(
    (tabA, tabB) => tabA.getId() - tabB.getId(),
  )
</script>

<UiItemBase {component} {root}>
  {#each sortedBrowers as tab (tab.getId())}
    <Browser {tab} selectedTab={$selectedTab} />
  {/each}
</UiItemBase>

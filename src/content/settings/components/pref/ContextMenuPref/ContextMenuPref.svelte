<script lang="ts">
  import {
    MENU_ITEM_ACTIONS,
    type MenuItem,
  } from '@shared/contextMenus/MenuItem'
  import { contextMenuPrefWrapper } from './prefWrapper'
  import InsertItem from './InsertItem.svelte'
  import ContextMenuPreview from './ContextMenuPreview.svelte'

  export let pref: string
  let value = contextMenuPrefWrapper(pref)
  let availableItems: MenuItem[]

  $: availableItems = [
    { type: 'separator' },
    ...MENU_ITEM_ACTIONS.filter((item) => !$value.includes(item)),
  ]
</script>

<div class="container">
  <div class="available">
    <h3>Available Items</h3>

    {#each availableItems as item}
      <InsertItem {item} />
    {/each}
  </div>

  <ContextMenuPreview items={value} />
</div>

<style>
  .container {
    display: flex;
    justify-content: space-evenly;
  }
</style>

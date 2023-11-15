<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

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

<div
  class="container"
  role="listbox"
  tabindex="-1"
  on:drop={(e) => {
    e.preventDefault()
    const [_, existingIndex] =
      e.dataTransfer?.getData('text/plain')?.split(':') ?? []
    if (!existingIndex) return
    value.update((items) => {
      const oldIndex = parseInt(existingIndex)
      const newItems = [...items]
      newItems.splice(oldIndex, 1)
      return newItems
    })
  }}
>
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

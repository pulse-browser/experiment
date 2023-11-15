<script lang="ts">
  import { fromId, type MenuItem } from '@shared/contextMenus'
  import type { Writable } from 'svelte/store'

  export let items: Writable<MenuItem[]>
  export let item: MenuItem

  let dropTarget = false
</script>

<div
  role="listitem"
  class={`item ${dropTarget ? 'drop-target' : ''}`}
  on:dragenter={(e) => {
    dropTarget = true
  }}
  on:dragleave={(e) => {
    dropTarget = false
  }}
  on:dragover={(e) => {
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  }}
  on:drop={(e) =>
    items.update((items) => {
      dropTarget = false

      const newItem = fromId(e.dataTransfer?.getData('text/plain') ?? '')
      const currentIndex = items.indexOf(item)
      const newItems = [...items]
      newItems.splice(currentIndex + 1, 0, newItem)
      return newItems
    })}
>
  {#if item.type === 'separator'}
    <hr />
  {:else}
    {item.title}
  {/if}
</div>

<style>
  .item {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 0.25rem;
    cursor: default;
    user-select: none;
  }

  .drop-target {
    border-bottom: solid 1px lightblue;
  }

  .item:hover {
    background-color: #ffffff11;
  }
</style>

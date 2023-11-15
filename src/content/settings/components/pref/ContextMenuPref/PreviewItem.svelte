<script lang="ts">
  import { fromId, type MenuItem } from '@shared/contextMenus'
  import type { Writable } from 'svelte/store'

  export let items: Writable<MenuItem[]>
  export let item: MenuItem
  export let index: number

  let dropTarget = false
  let dragging = false
</script>

<div
  role="listitem"
  class={`item ${dropTarget ? 'drop-target' : ''} ${
    dragging ? 'dragging' : ''
  }`}
  draggable="true"
  on:dragstart={(e) => {
    e.dataTransfer?.setData(
      'text/plain',
      (item.type === 'separator' ? 'separator' : item.id) + ':' + index,
    )
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
    dragging = true
  }}
  on:dragend={(e) => {
    dragging = false
  }}
  on:dragenter={(e) => {
    if (dragging) return
    dropTarget = true
  }}
  on:dragleave={(e) => {
    if (dragging) return
    dropTarget = false
  }}
  on:dragover={(e) => {
    if (dragging) return
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  }}
  on:drop={(e) =>
    items.update((items) => {
      e.preventDefault()
      if (dragging) return items
      dropTarget = false

      const [newItemId, existingIndex] =
        e.dataTransfer?.getData('text/plain')?.split(':') ?? []
      const newItem = fromId(newItemId)
      let newIndex = items.indexOf(item) + 1
      const newItems = [...items]
      // Remove old item
      if (existingIndex) {
        const oldIndex = parseInt(existingIndex)
        newItems.splice(parseInt(existingIndex), 1)
        if (oldIndex < newIndex) newIndex--
      }
      newItems.splice(newIndex, 0, newItem)
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

  .dragging {
    opacity: 0.5;
  }

  .drop-target {
    border-bottom: solid 1px lightblue;
  }

  .item:hover {
    background-color: #ffffff11;
  }
</style>

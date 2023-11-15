<script lang="ts">
  import { fromId, type MenuItem } from '@shared/contextMenus'
  import type { Writable } from 'svelte/store'

  export let items: Writable<MenuItem[]>
  export let item: MenuItem
  export let index: number

  let drop: 'start' | 'end' | false = false
  let dragging = false
</script>

<div
  role="listitem"
  class={`item ${drop} ${dragging ? 'dragging' : ''}`}
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
  on:dragover={(e) => {
    if (dragging) return

    const boundingRect = e.currentTarget.getBoundingClientRect()
    const yMiddle = boundingRect.y + boundingRect.height / 2
    const isBefore = e.y <= yMiddle
    drop = isBefore ? 'start' : 'end'
  }}
  on:dragleave={(e) => {
    if (dragging) return
    drop = false
  }}
  on:dragover={(e) => {
    if (dragging) return
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  }}
  on:drop|preventDefault|stopPropagation={(e) => {
    items.update((items) => {
      if (dragging) return items

      const [newItemId, existingIndex] =
        e.dataTransfer?.getData('text/plain')?.split(':') ?? []

      const newItems = [...items]

      let newItem
      let wasBefore = false
      if (existingIndex) {
        const oldIndex = parseInt(existingIndex)
        newItem = newItems.splice(oldIndex, 1)[0]
        wasBefore = oldIndex < index
      } else {
        newItem = fromId(newItemId)
      }

      const newIndex = index + (drop === 'start' ? 0 : 1) - (wasBefore ? 1 : 0)
      newItems.splice(newIndex, 0, newItem)

      return newItems
    })
    drop = false
  }}
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

  .start {
    border-top: solid 1px lightblue;
  }

  .end {
    border-bottom: solid 1px lightblue;
  }

  .item:hover {
    background-color: #ffffff11;
  }
</style>

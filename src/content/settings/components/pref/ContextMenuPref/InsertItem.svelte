<script lang="ts">
  import type { MenuItem } from '@shared/contextMenus'

  export let item: MenuItem
  export let dragging = false
</script>

<div
  class={`item ${dragging ? 'hidden' : ''}`}
  role="listitem"
  draggable="true"
  on:dragstart={(e) => {
    e.dataTransfer?.setData(
      'text/plain',
      item.type === 'separator' ? 'separator' : item.id,
    )
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
    dragging = true
  }}
  on:dragend={(e) => {
    dragging = false
  }}
>
  {item.type === 'separator' ? 'Separator' : item.title}
</div>

<style>
  .item {
    background-color: var(--surface-1);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    margin-bottom: 0.25rem;

    user-select: none;
  }

  .hidden {
    color: var(--subtext);
  }
</style>

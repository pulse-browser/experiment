<script lang="ts">
  import { type Tab } from './tab'
  import { closeTab, moveTabBefore, moveTabAfter } from '../../lib/globalApi'
  import type { DragEventHandler } from 'svelte/elements'

  export let tab: Tab
  export let selectedTab: number

  let lastDragIsBefore: undefined | boolean

  const { title, icon } = tab

  $: tab.getId() == selectedTab && (document.title = $title)

  const dragOver: DragEventHandler<HTMLDivElement> = (e) => {
    if (!e.currentTarget.classList.contains('tab')) return

    const boundingRect = e.currentTarget.getBoundingClientRect()

    const xMiddle = boundingRect.x + boundingRect.width / 2
    const isBefore = e.x <= xMiddle

    const dragId = parseInt(e.dataTransfer?.getData('text/plain') || '-1')
    if (dragId == tab.getId()) return
    if (lastDragIsBefore === isBefore) return
    lastDragIsBefore = isBefore

    if (isBefore) {
      moveTabBefore(dragId, tab.getId())
    } else {
      moveTabAfter(dragId, tab.getId())
    }
  }
</script>

<div
  on:click={() => (selectedTab = tab.getId())}
  on:mouseup={(e) => {
    // When the middle mouse button is clicked, close this tab
    if (e.button == 1) closeTab(tab)
  }}
  on:dragstart={(e) =>
    e.dataTransfer?.setData('text/plain', tab.getId().toString())}
  on:dragover={dragOver}
  class="tab"
  aria-selected={tab.getId() == selectedTab}
  draggable="true"
>
  <img class="tab__icon" src={$icon} />
  <span>{$title}</span>
  <button class="tab__close" on:click={() => closeTab(tab)}>
    <i class="ri-close-line" />
  </button>
</div>

<style>
  .tab {
    padding: 0.25rem 1rem;
    margin: 0.25rem 0;
    font-size: 1.25rem;
    border-radius: 0.5rem;

    display: flex;
    align-items: center;

    cursor: default;
  }

  .tab[aria-selected='true'] {
    background: var(--surface-1) !important;
    padding-right: 0.25rem;
  }

  .tab[aria-selected='false'] .tab__close {
    display: none;
  }

  .tab:hover {
    background: var(--surface-0);
  }

  .tab__close {
    background: none;
    border: none;
    margin-left: 0.5rem;
    padding: 0;
    border-radius: 0.25rem;

    width: 2rem;
    height: 2rem;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
  }

  .tab__close:hover {
    background: var(--surface-2);
  }

  .tab__icon {
    height: 1.5rem;
    width: 1.5rem;
    margin-right: 0.5rem;
  }
</style>

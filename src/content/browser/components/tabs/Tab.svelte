<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type { Tab } from '@browser/lib/window/tab'
  import type { DragEventHandler } from 'svelte/elements'
  import Spinner from '@shared/components/Spinner.svelte'
  import {
    moveTabBefore,
    moveTabAfter,
    closeTab,
  } from '@browser/lib/window/tabs'

  export let tab: Tab
  export let selectedTab: number

  let lastDragIsBefore: undefined | boolean

  const { title, icon, uri, loading } = tab

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

<!-- svelte-ignore a11y-click-events-have-key-events -->
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
  role="tab"
  tabindex={tab.getId()}
  aria-selected={tab.getId() == selectedTab}
  draggable="true"
>
  {#if $loading}
    <div class="tab__start-item">
      <Spinner />
    </div>
  {:else if $icon}
    <img class="tab__icon tab__start-item" src={$icon} alt="favicon" />
  {/if}
  <span>{$title || $uri.asciiSpec}</span>
  <button
    class="tab__close"
    on:click={() => closeTab(tab)}
    on:keydown={(e) => e.key === 'Enter' && closeTab(tab)}
  >
    <i class="ri-close-line" />
  </button>
</div>

<style>
  .tab {
    padding: 0.25rem 1rem;
    margin: 0.25rem 0;
    font-size: 1.25rem;
    border-radius: 0.5rem;
    max-width: 16rem;

    display: flex;
    align-items: center;

    cursor: default;
  }

  .tab span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
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
    flex-shrink: 0;

    cursor: pointer;
  }

  .tab__close:hover {
    background: var(--surface-2);
  }

  .tab__start-item {
    margin-right: 0.5rem;
    /* The spinner uses em to size, we can resize it with font size */
    font-size: 1rem;
  }

  .tab__icon {
    height: 1.5rem;
    width: 1.5rem;
  }
</style>

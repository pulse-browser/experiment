<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type { Tab } from '@browser/lib/window/tab'
  import Spinner from '@shared/components/Spinner.svelte'
  import { closeTab } from '@browser/lib/window/tabs'
  import { createTabDrag } from './tabDrag'

  export let tab: Tab
  export let selectedTab: number

  $: title = tab.title
  $: icon = tab.icon
  $: uri = tab.uri
  $: loading = tab.loading

  $: tabDragInfo = createTabDrag(tab)
  $: tabDrag = tabDragInfo.tabDrag
  $: before = tabDragInfo.drop.before
  $: after = tabDragInfo.drop.after

  $: selected = tab.getId() === selectedTab
  $: selected && (document.title = $title)
</script>

<div class="drop-indicator" data-active={$before} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  use:tabDrag
  on:click={() => (selectedTab = tab.getId())}
  on:mouseup={(e) => {
    // When the middle mouse button is clicked, close this tab
    if (e.button == 1) closeTab(tab)
  }}
  class="tab"
  role="tab"
  tabindex={tab.getId()}
  aria-selected={selected}
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

<div class="drop-indicator" data-active={$after} />

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

  .drop-indicator {
    width: 1px;
  }

  .drop-indicator[data-active='true'] {
    background: var(--active);
  }
</style>

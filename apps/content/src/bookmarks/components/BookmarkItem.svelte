<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type { TreeNode } from '../../shared/ExtBookmarkAPI'

  export let node: TreeNode
  export let selectedBookmark: string | undefined

  let opened = false
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="bookmark-item"
  on:click={() => {
    opened = !opened
    selectedBookmark = node.id
  }}
  aria-selected={selectedBookmark == node.id}
>
  <div class="arrow">
    <i
      class={opened ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'}
      hidden={node.type != 'folder'}
    />
  </div>
  <div class="icon">
    {#if node.type === 'folder'}
      <i class="ri-folder-line" />
    {:else if node.type === 'bookmark'}
      <i class="ri-bookmark-line" />
    {:else if node.type === 'separator'}
      <i class="ri-separator" />
    {/if}
  </div>
  <div class="title">{node.title}</div>
</div>

<div class="bookmark-children" hidden={!opened}>
  {#each node.children || [] as child}
    <svelte:self bind:node={child} bind:selectedBookmark />
  {/each}
</div>

<style>
  .bookmark-item {
    display: flex;
    gap: 0.5rem;
    cursor: pointer;
  }

  .arrow {
    width: 1rem;
    height: 1rem;
  }

  .bookmark-item[aria-selected='true'] {
    background-color: var(--surface);
  }

  .bookmark-children {
    margin-left: 0.5rem;
  }
</style>

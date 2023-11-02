<script lang="ts">
  import type { TreeNode } from '../../shared/ExtBookmarkAPI'

  export let node: TreeNode
  let opened = false
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="bookmark-item"
  on:click={() => (opened = !opened)}
  aria-selected={opened}
>
  <div class="arrow">
    <i class={opened ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'} />
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
    <svelte:self bind:node={child} />
  {/each}
</div>

<style>
  .bookmark-item {
    display: flex;
    gap: 0.5rem;
  }

  .arrow {
    width: 1rem;
    height: 1rem;
  }

  .bookmark-item[aria-selected='true'] {
    background-color: color-mix(in srgb, var(--active) 20%, transparent);
  }
</style>

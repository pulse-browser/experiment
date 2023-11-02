<script lang="ts">
  import type { TreeNode } from '../../shared/ExtBookmarkAPI'
  import BookmarkItem from './BookmarkItem.svelte'

  export let tree: TreeNode[]
  export let selectedBookmark: string | undefined
</script>

{#each tree as node}
  <BookmarkItem bind:node />
{/each}

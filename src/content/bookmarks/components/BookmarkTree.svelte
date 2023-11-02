<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type { TreeNode } from '../../shared/ExtBookmarkAPI'
  import BookmarkItem from './BookmarkItem.svelte'

  export let tree: TreeNode[]
  export let selectedBookmark: string | undefined
</script>

{#each tree as node}
  <BookmarkItem bind:node />
{/each}

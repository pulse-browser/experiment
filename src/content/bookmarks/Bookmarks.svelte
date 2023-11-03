<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import { writable, type Writable } from 'svelte/store'
  import { get, getFullTree, type TreeNode } from '../shared/ExtBookmarkAPI'
  import BookmarkEditor from './components/BookmarkEditor.svelte'
  import BookmarkTree from './components/BookmarkTree.svelte'

  const fullTree: Writable<Promise<TreeNode[]>> = writable(getFullTree())
  let selectedBookmarkId: string | undefined = undefined
  let selectedBookmark: TreeNode | undefined = undefined

  // When updating the selected bookmark, we don't want to make sure it has
  // loaded before changing to reduce flicker
  $: if (selectedBookmarkId)
    get(selectedBookmarkId).then((node) => (selectedBookmark = node))
</script>

<div class="container">
  {#await $fullTree}
    <p>Loading...</p>
  {:then tree}
    <BookmarkTree bind:selectedBookmark={selectedBookmarkId} {tree} />

    {#if selectedBookmark}
      <BookmarkEditor
        bind:selectedBookmarkId
        {fullTree}
        {selectedBookmark}
        on:delete={() => {
          selectedBookmarkId = undefined
          selectedBookmark = undefined
        }}
      />
    {/if}
  {/await}
</div>

<style>
  .container {
    display: flex;
    height: 100%;
  }
</style>

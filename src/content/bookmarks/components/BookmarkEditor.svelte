<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type { Writable } from 'svelte/store'
  import {
    update,
    type TreeNode,
    remove,
    getFullTree,
  } from '../../shared/ExtBookmarkAPI'
  import { Button } from '../../shared/components'
  import TextInput from '../../shared/components/TextInput.svelte'
  import { createEventDispatcher } from 'svelte'

  export let fullTree: Writable<Promise<TreeNode[]>>
  export let selectedBookmark: TreeNode
  export let selectedBookmarkId: string | undefined

  let id: string
  let title: string
  let url: string | undefined

  const dispatch = createEventDispatcher()

  $: changeBookmark(selectedBookmark)

  function changeBookmark(bookmark: TreeNode) {
    id = bookmark.id
    title = bookmark.title
    url = bookmark.type == 'bookmark' ? bookmark.url : undefined
  }

  function updateBookmark() {
    update(id, { title, url })
  }
</script>

<div class="container">
  <TextInput bind:value={title} on:keyup={updateBookmark}>Title</TextInput>

  {#if url}
    <TextInput bind:value={url} on:keyup={updateBookmark}>URL</TextInput>
  {/if}

  <Button
    kind="secondary"
    on:click={() => {
      remove(id)
        .then(() => getFullTree())
        .then((ft) => {
          fullTree.set(new Promise((res) => res(ft)))
          dispatch('delete')
        })
    }}>Delete</Button
  >
</div>

<style>
  .container {
    width: 16rem;
    background-color: var(--surface);
    padding: 0.5rem;
  }
</style>

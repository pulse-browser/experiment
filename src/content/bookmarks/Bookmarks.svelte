<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import { getFullTree } from '../shared/ExtBookmarkAPI'
  import BookmarkTree from './components/BookmarkTree.svelte'

  const fullTree = getFullTree()
  let selectedBookmark: string | undefined = undefined
</script>

<div class="container">
  {#await fullTree}
    <p>Loading...</p>
  {:then tree}
    <BookmarkTree bind:selectedBookmark {tree} />
  {/await}
</div>

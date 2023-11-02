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

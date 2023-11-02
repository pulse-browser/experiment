<script lang="ts">
  import {
    search,
    type BookmarkTreeNode,
  } from '../../../../shared/ExtBookmarkAPI'
  import { Button } from '../../../../shared/components'
  import TextInput from '../../../../shared/components/TextInput.svelte'
  import { resource } from '../../../lib/resources'
  import type { Tab } from '../../tabs/tab'

  export let tab: Tab

  let panel: any
  let bookmarkButton: any
  let inputContent: string = ''

  $: uri = tab.uri

  const unbindedSetInputContent = (value: string) => (inputContent = value)
  $: unbindedSetInputContent($uri.asciiSpec)

  $: bookmarkResults = search({ url: $uri.asciiSpec })
  $: bookmarkInfo = bookmarkResults.then((bookmarks) =>
    bookmarks.length > 0 ? (bookmarks[0] as BookmarkTreeNode) : undefined
  )
</script>

<div class="omnibox">
  <input
    class="toolbar__urlbar"
    type="text"
    bind:value={inputContent}
    on:keydown={(e) => {
      console.log(e)
      if (e.key === 'Enter') tab.goToUri(resource.NetUtil.newURI(inputContent))
    }}
  />

  {#await bookmarkInfo then bookmark}
    <button
      bind:this={bookmarkButton}
      on:click={() => panel.openPopup(bookmarkButton, 'bottomright topright')}
    >
      <i class={bookmark ? 'ri-bookmark-fill' : 'ri-bookmark-line'} />
    </button>
  {/await}
</div>

<xul:panel bind:this={panel} class="bookmark-panel">
  <div class="bookmark-panel__container">
    <h1>Add bookmark</h1>

    <TextInput>Name</TextInput>
    <!-- TODO: Location -->
    <TextInput>Tags</TextInput>

    <div class="bookmark-panel__buttons">
      <Button kind="secondary">Cancel</Button>
      <Button kind="primary">Save</Button>
    </div>
  </div>
</xul:panel>

<style>
  * {
    border: none;
    background: none;
  }

  .omnibox {
    flex-grow: 1;
    display: flex;
  }

  .toolbar__urlbar {
    flex-grow: 1;
    border-radius: 0.5rem;
    height: 2.5rem;
    padding: 0 1rem;
    background: var(--base);
  }

  .toolbar__urlbar:focus {
    outline: solid var(--active-border);
  }

  .bookmark-panel {
    --panel-border-radius: 1rem;
    --panel-background: var(--surface);
    --panel-color: var(--text);
  }

  .bookmark-panel h1 {
    margin: 0;
    margin-bottom: 0.25rem;
    font-size: 1.5rem;
  }

  .bookmark-panel__container {
    padding: 1rem;
    padding-top: 0.5rem;
  }

  .bookmark-panel__buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }
</style>

<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import { onMount } from 'svelte'

  import { Button } from '@shared/components'
  import TextInput from '@shared/components/TextInput.svelte'
  import {
    create,
    type BookmarkTreeNode,
    update,
    remove,
  } from '@shared/ExtBookmarkAPI'
  import ToolbarButton from '@shared/components/ToolbarButton.svelte'

  import type { Tab } from '../tabs/tab'

  export let tab: Tab

  let panel: any
  let bookmarkButton: any

  let name: string = ''

  $: title = tab.title
  $: bookmarkInfo = tab.bookmarkInfo

  $: name = $title

  async function createBookmark() {
    const bookmark = (await create({
      title: name,
      type: 'bookmark',
      url: tab.uri.readOnce().asciiSpec,
    })) as BookmarkTreeNode

    tab.bookmarkInfo.set(bookmark)

    panel.hidePopup()
  }

  async function updateBookmark() {
    if (!$bookmarkInfo) {
      throw new Error("Cannot update a bookmark that doesn't exist ")
    }

    const bookmark = await update($bookmarkInfo.id, { title: name })
    bookmarkInfo.set(bookmark as BookmarkTreeNode)

    panel.hidePopup()
  }

  async function removeBookmark() {
    if (!$bookmarkInfo) {
      throw new Error("Cannot remove a bookmark that doesn't exist ")
    }

    await remove($bookmarkInfo.id)
    bookmarkInfo.set(null)

    panel.hidePopup()
  }

  const OPEN_BOOKMARK_PANEL = () =>
    panel.openPopup(bookmarkButton, 'bottomright topright')
  onMount(() => {
    window.windowApi.windowTriggers.on(
      'bookmarkCurrentPage',
      OPEN_BOOKMARK_PANEL,
    )
  })
</script>

<ToolbarButton
  bind:button={bookmarkButton}
  on:click={OPEN_BOOKMARK_PANEL}
  kind="page-icon"
>
  <i class={$bookmarkInfo ? 'ri-bookmark-fill' : 'ri-bookmark-line'} />
</ToolbarButton>

<xul:panel bind:this={panel} class="bookmark-panel">
  <div class="bookmark-panel__container">
    <h1>Add bookmark</h1>

    <TextInput bind:value={name}>Name</TextInput>
    <!-- TODO: Location -->
    <TextInput>Tags</TextInput>

    <div class="bookmark-panel__buttons">
      {#if $bookmarkInfo}
        <Button kind="secondary" on:click={removeBookmark}>Delete</Button>
        <Button kind="primary" on:click={updateBookmark}>Update</Button>
      {:else}
        <Button kind="secondary" on:click={() => panel.hidePopup()}>
          Cancel
        </Button>
        <Button kind="primary" on:click={createBookmark}>Create</Button>
      {/if}
    </div>
  </div>
</xul:panel>

<style>
  * {
    border: none;
    background: none;
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
    padding: 0.5rem 1rem;
  }

  .bookmark-panel__buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }
</style>

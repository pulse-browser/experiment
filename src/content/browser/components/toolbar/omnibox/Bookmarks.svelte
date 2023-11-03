<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type { Tab } from '../../tabs/tab'
  import { Button } from '../../../../shared/components'
  import TextInput from '../../../../shared/components/TextInput.svelte'
  import {
    create,
    type BookmarkTreeNode,
  } from '../../../../shared/ExtBookmarkAPI'

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

    console.log(bookmark)
    tab.bookmarkInfo.set(bookmark)

    panel.hidePopup()
  }
</script>

<button
  bind:this={bookmarkButton}
  on:click={() => panel.openPopup(bookmarkButton, 'bottomright topright')}
>
  <i class={$bookmarkInfo ? 'ri-bookmark-fill' : 'ri-bookmark-line'} />
</button>

<xul:panel bind:this={panel} class="bookmark-panel">
  <div class="bookmark-panel__container">
    <h1>Add bookmark</h1>

    <TextInput bind:value={name}>Name</TextInput>
    <!-- TODO: Location -->
    <TextInput>Tags</TextInput>

    <div class="bookmark-panel__buttons">
      <Button kind="secondary" on:click={() => panel.hidePopup()}>
        Cancel
      </Button>
      <Button kind="primary" on:click={createBookmark}>Save</Button>
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

<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type { MenuItem } from '@shared/contextMenus'
  import type { Writable } from 'svelte/store'

  import PreviewItem from './PreviewItem.svelte'
  export let items: Writable<MenuItem[]>
</script>

<div class="preview__container">
  <div class="preview">
    {#each $items as item, index}
      <PreviewItem {items} {item} {index} />
    {/each}
  </div>
</div>

<style>
  .preview__container {
    background-color: var(--surface-1);
    padding: 2rem;
    border-radius: 1rem;
  }

  .preview {
    background-color: var(--base);
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
    padding: 0.25rem;
    border-radius: 0.5rem;
  }
</style>

<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script context="module" lang="ts">
  import type { Readable } from 'svelte/store'
  type StoreType<T> = T extends Readable<infer Q> ? Q : any

  // prettier-ignore
  export type ItemType = ReturnType<StoreType<TreeView['elements']['item']>>;
</script>

<script lang="ts">
  import { melt, type TreeView } from '@melt-ui/svelte'

  export let title: string
  export let mlt: ItemType
</script>

<button use:melt={mlt} class="tree-item">
  <span class="icon">
    <slot />
  </span>

  <span class="title">{title}</span>
</button>

<style>
  .tree-item {
    border: none;
    margin: 0;
    padding: 0.25rem;
    border-radius: 0.25rem;
    background: none;

    width: 100%;
    text-align: left;

    display: flex;
  }

  .tree-item:hover {
    background: var(--surface);
  }

  .tree-item .title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 90%;
  }

  .tree-item .icon {
    display: flex;
    align-items: center;
    margin-right: 0.5rem;
  }
</style>

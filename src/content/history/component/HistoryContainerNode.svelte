<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import { getContext } from 'svelte'
  import HistoryNode from './HistoryNode.svelte'
  import { melt, type TreeView } from '@melt-ui/svelte'
  import { nanoid } from 'nanoid'
  import Entry from './Entry.svelte'

  export let node: nsINavHistoryContainerResultNodeType
  export let treeId: string

  let open = node.containerOpen
  const id = nanoid()
  const {
    elements: { item, group },
    helpers: { isExpanded },
  } = getContext<TreeView>(treeId)

  $: open = $isExpanded(id)
  $: node.containerOpen = open
  $: children = !open
    ? []
    : Array.from(Array(node.childCount)).map((_, i) => node.getChild(i))
</script>

<li>
  <Entry mlt={$item({ id, hasChildren: true })} title={node.title}>
    {#if open}
      <i class="ri-arrow-drop-down-line" />
    {:else}
      <i class="ri-arrow-drop-right-line" />
    {/if}
  </Entry>

  <ul use:melt={$group({ id })} class="tree-group">
    {#if open}
      {#each children as node}
        <HistoryNode {treeId} {node} />
      {/each}
    {/if}
  </ul>
</li>

<style>
  .tree-group {
    padding-inline-start: 2rem;
  }
</style>

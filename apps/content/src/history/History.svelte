<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import { HistoryGroupType, searchableHistoryModel } from '@experiment/shared'
  import { readable } from 'svelte/store'
  import HistoryNode from './component/HistoryNode.svelte'
  import { TreeView } from '@shared/components/Tree'

  export let treeId: string = 'tree-history'

  const model = searchableHistoryModel(
    readable(''),
    readable(HistoryGroupType.GroupByDate),
  )

  $: root = $model.root
  $: root && (root.containerOpen = true)
  $: children = root
    ? Array.from(Array(root.childCount)).map((_, i) => root!.getChild(i))
    : []
</script>

<main>
  {#if $model.root}
    <TreeView bind:treeId>
      {#each children as child}
        <HistoryNode {treeId} node={child} />
      {/each}
    </TreeView>
  {/if}
</main>

<style>
  main {
    overflow-y: scroll;
    height: 100%;
  }
</style>

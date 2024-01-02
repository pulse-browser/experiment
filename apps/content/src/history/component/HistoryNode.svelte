<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import HistoryContainerNode from './HistoryContainerNode.svelte'
  import HistoryItemNode from './HistoryItemNode.svelte'

  export let node: nsINavHistoryResultNodeType
  export let treeId: string

  // @ts-expect-error Ci is not correctly typed
  $: isContainer = node instanceof Ci.nsINavHistoryContainerResultNode
</script>

{#if isContainer}
  <HistoryContainerNode {treeId} {node} />
{:else}
  <HistoryItemNode {treeId} {node} />
{/if}

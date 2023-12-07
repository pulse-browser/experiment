<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type { TreeView } from '@melt-ui/svelte'
  import { nanoid } from 'nanoid'
  import { getContext } from 'svelte'
  import Entry from './Entry.svelte'

  export let node: nsINavHistoryResultNodeType
  export let treeId: string

  const id = nanoid()
  const {
    elements: { item },
  } = getContext<TreeView>(treeId)

  $: title = node.title || node.uri
</script>

<Entry mlt={$item({ id })} {title}>
  <img src={node.icon} />
</Entry>

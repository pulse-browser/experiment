<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import { createTreeView } from '@melt-ui/svelte'
  import { nanoid } from 'nanoid'
  import { setContext } from 'svelte'

  export let treeId = `tree-${nanoid()}`

  let context = createTreeView()
  setContext(treeId, context)

  const {
    elements: { tree },
  } = context
</script>

<ul {...$tree} class="tree-root">
  <slot />
</ul>

<style>
  .tree-root {
    list-style: none;
    padding: 0;
    margin: 0;

    max-width: 100vw;
  }
</style>

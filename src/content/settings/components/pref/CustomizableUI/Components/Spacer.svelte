<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import {
    getParentOrientation,
    type BlockComponent,
    type ComponentId,
    type SpacerComponent,
  } from '@shared/customizableUI'

  export let component: ComponentId & SpacerComponent
  export let root: ComponentId & BlockComponent
  export let verbose = false

  $: parentOrientation = getParentOrientation(root, component)
</script>

{#if verbose}
  Spacer
{:else}
  <div class={`spacer-vis ${parentOrientation}`}></div>
{/if}

<style>
  .spacer-vis {
    border: white 0.5px dashed;
    flex-grow: 1;
    align-self: center;
  }
</style>

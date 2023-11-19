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

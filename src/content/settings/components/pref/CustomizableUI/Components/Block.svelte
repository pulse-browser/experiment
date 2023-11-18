<script lang="ts">
  import {
    tempDropTarget,
    type BlockComponent,
    type ComponentId,
  } from '@shared/customizableUI'
  import Component from '../Component.svelte'

  export let component: ComponentId & BlockComponent
  export let root: ComponentId & BlockComponent
  export let selectedId: string | null
  export let verbose = false
</script>

{#each component.content as child}
  <Component {verbose} bind:root bind:component={child} bind:selectedId />
{:else}
  <Component
    {verbose}
    bind:root
    bind:selectedId
    component={tempDropTarget(component.id)}
  />
{/each}

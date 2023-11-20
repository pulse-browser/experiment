<script lang="ts">
  import {
    getParentOrientation,
    type Component,
    getComponentStyle,
  } from '@shared/customizableUI'

  let clazz = ''
  export { clazz as class }

  export let component: Component
  export let root: Component

  $: parentOrientation = getParentOrientation(root, component)
  $: style = getComponentStyle(component, parentOrientation, false)
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class={`component ${clazz}`} {style} on:drop>
  <slot />
</div>

<style>
  .component {
    border-style: solid;
    border-width: 1px;
    border-color: transparent;
    cursor: pointer;
  }
</style>

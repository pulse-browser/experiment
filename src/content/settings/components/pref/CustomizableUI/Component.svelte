<script context="module" lang="ts">
  import mitt from 'mitt'
  const listener = mitt<{ clearHover: undefined }>()
</script>

<script lang="ts">
  import {
    getComponentStyle,
    type BlockComponent,
    type Component,
    type ComponentId,
    getParentOrientation,
    calculateDropTargetRel,
    isParent,
    applyDrop,
  } from '@shared/customizableUI'
  import { nanoid } from 'nanoid'
  import {
    Block,
    Browser,
    IconButton,
    Spacer,
    TempDropTarget,
  } from './Components'
  import Omnibox from './Components/Omnibox.svelte'

  export let component: Component
  export let root: ComponentId & BlockComponent
  export let selectedId: string | null
  export let verbose = false
  export let draggable = true

  let hover = false
  let dropTarget: 'before' | 'after' | null = null

  $: canDrag = draggable && !isRoot && component.type !== 'temp-drop-target'
  $: parentOrientation = getParentOrientation(root, component)
  $: componentStyle = getComponentStyle(component)
  $: selected = selectedId === component.id
  $: isRoot = root.id === component.id

  listener.on('clearHover', () => (hover = false))
</script>

{#if !isRoot}
  <div class={`drop-target ${dropTarget === 'before' && 'active'}`}></div>
{/if}

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class={`component ${component.type} ${hover && 'hover'} ${isRoot && 'root'}`}
  aria-checked={selected}
  style={componentStyle}
  draggable={canDrag}
  on:mousemove={(e) => {
    if (!canDrag) return
    e.stopPropagation()
    if (hover) return
    listener.emit('clearHover')
    hover = true
  }}
  on:click={(e) => {
    if (!draggable || component.type === 'temp-drop-target') return
    e.stopPropagation()
    selectedId = component.id
  }}
  on:dragstart={(e) => {
    if (!canDrag) return
    e.stopPropagation()
    e.dataTransfer?.setData('component', JSON.stringify(component))
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
  }}
  on:dragover={(e) => {
    e.stopPropagation()
    e.preventDefault()

    const data = JSON.parse(e.dataTransfer?.getData('component') ?? 'false')
    if (!data) return
    if (data.id === component.id) return

    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
    dropTarget = calculateDropTargetRel(parentOrientation, e)
  }}
  on:dragleave|stopPropagation={() => (dropTarget = null)}
  on:drop|preventDefault|stopPropagation={(e) => {
    const data = JSON.parse(e.dataTransfer?.getData('component') ?? 'false')
    if (!data || !dropTarget || isParent(data, component)) {
      dropTarget = null
      return
    }
    applyDrop(root, data, component, dropTarget)

    // Force an update
    root.id = nanoid()
    dropTarget = null
  }}
>
  {#if component.type === 'block'}
    <Block bind:component bind:root bind:selectedId {verbose} />
  {:else if component.type === 'icon'}
    <IconButton bind:component />
  {:else if component.type === 'spacer'}
    <Spacer {verbose} bind:component bind:root />
  {:else if component.type === 'browser'}
    <Browser />
  {:else if component.type === 'omnibox'}
    <Omnibox {verbose} />
  {:else if component.type === 'temp-drop-target'}
    <TempDropTarget {verbose} />
  {/if}
</div>

{#if !isRoot}
  <div class={`drop-target ${dropTarget === 'after' && 'active'}`}></div>
{/if}

<style>
  .drop-target {
    border-style: solid;
    border-width: 1px;
    border-color: transparent;
    flex-shrink: 1;
  }

  .drop-target.active {
    border-color: red;
  }

  .component {
    border-style: solid;
    border-width: 1px;
    border-color: transparent;
    cursor: pointer;
  }

  .component[aria-checked='true'] {
    border-color: blue !important;
  }

  .component.hover {
    border-color: lightblue;
  }

  .component.root {
    height: 100%;
  }
</style>

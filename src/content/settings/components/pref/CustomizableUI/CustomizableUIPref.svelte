<script lang="ts">
  import { createBlock, cuiPreviewItems } from '@shared/customizableUI'
  import Component from './Component.svelte'
  import { nanoid } from 'nanoid'
  import Configure from './Configure.svelte'

  let component = createBlock('vertical', [], { type: 'grow', value: 1 })
  let selectedId: string | null = null
  $: console.log(component)
</script>

<div class="container">
  <div class="items">
    <h3>Items</h3>

    {#each cuiPreviewItems as item}
      <div class={`item ${!item.canAdd(component) && 'unusable'}`}>
        <Component
          component={{ id: nanoid(), ...item.component }}
          draggable={item.canAdd(component)}
          root={createBlock()}
          verbose={true}
          selectedId=""
        />

        <div style:flex-grow="1" />
      </div>
    {/each}
  </div>

  <div class="preview">
    <Component bind:component bind:root={component} bind:selectedId />
  </div>

  <div class="configure">
    <h3>Configure item</h3>

    {#if selectedId}
      <Configure bind:root={component} bind:selectedId />
    {/if}
  </div>
</div>

<style>
  .container {
    display: flex;
  }

  .item {
    display: flex;
    margin-bottom: 0.25rem;
  }

  .item.unusable {
    opacity: 0.5;
  }

  .preview {
    background-color: var(--base);
    flex-grow: 1;
  }

  .configure {
    width: 20rem;
    background-color: var(--surface-1);
    padding: 1rem;
  }

  .configure h3 {
    margin-top: 0;
  }
</style>

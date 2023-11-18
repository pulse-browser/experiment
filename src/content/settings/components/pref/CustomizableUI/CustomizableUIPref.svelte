<script lang="ts">
  import { createBlock, cuiPreviewItems } from '@shared/customizableUI'
  import Component from './Component.svelte'
  import { nanoid } from 'nanoid'

  let component = createBlock('vertical', [], { type: 'grow', value: 1 })
  let selectedId: string | null = null
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
    <Component bind:component bind:root={component} {selectedId} />
  </div>
</div>

<style>
  .container {
    display: flex;
  }

  .item {
    display: flex;
    margin-bottom: 1rem;
  }

  .item.unusable {
    opacity: 0.5;
  }

  .preview {
    background-color: var(--base);
    flex-grow: 1;
  }
</style>

<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import {
    createBlock,
    cuiPreviewItems,
    fromExportType,
    removeChildById,
    toExportType,
  } from '@shared/customizableUI'
  import Component from './Component.svelte'
  import { nanoid } from 'nanoid'
  import Configure from './Configure.svelte'
  import { Button } from '@shared/components'

  let component = fromExportType(
    JSON.parse(
      Services.prefs.getStringPref('browser.uiCustomization.state', '{}'),
    ),
  )
  let selectedId: string | null = null
  $: console.log(JSON.stringify(toExportType(component)))
  $: Services.prefs.setStringPref(
    'browser.uiCustomization.state',
    JSON.stringify(toExportType(component)),
  )
</script>

<p>
  <strong>Warning:</strong> Editing this layout will likely unload all of your tabs!
  Proceed with caution
</p>

<div class="container">
  <div class="items">
    <h3>Items</h3>

    {#each cuiPreviewItems as item}
      <div class={`item ${!item.canAdd(component) && 'unusable'}`}>
        <Component
          component={{ id: nanoid(21, component.id), ...item.component }}
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

      {#if selectedId !== component.id}
        <Button
          on:click={() => (component = removeChildById(selectedId, component))}
          >Remove</Button
        >
      {/if}
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

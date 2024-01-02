<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import {
    type Component,
    findChildWithId,
    prefs,
    updateComponentById,
  } from '@shared/customizableUI'

  export let root: Component
  export let selectedId: string

  $: selectedComponent = findChildWithId(root, selectedId ?? '')
  $: selectedPrefs = selectedComponent?.type && prefs[selectedComponent.type]
  $: update = updateComponentById(root, selectedId)
</script>

{#if selectedComponent && selectedPrefs}
  {#each selectedPrefs as pref}
    <div class="pref">
      <label for={pref.key}>{pref.key}</label>

      {#if pref.type === 'string'}
        {#if pref.options}
          <select
            id={pref.key}
            value={selectedComponent[pref.key]}
            on:change={(e) =>
              (root = update((c) => {
                c[pref.key] = e.target.value
                return c
              }))}
          >
            {#each pref.options as option}
              <option value={option}>{option}</option>
            {/each}
          </select>
        {:else}
          <input
            type="text"
            id={pref.key}
            value={selectedComponent[pref.key]}
            on:change={(e) =>
              (root = update((c) => {
                c[pref.key] = e.target.value
                return c
              }))}
          />
        {/if}
      {/if}

      {#if pref.type === 'number'}
        <input
          type="number"
          id={pref.key}
          value={selectedComponent[pref.key]}
          on:change={(e) =>
            (root = update((c) => {
              c[pref.key] = Number(e.target.value)
              return c
            }))}
        />
      {/if}

      {#if pref.type === 'block-size'}
        <select
          value={selectedComponent[pref.key].type}
          on:change={(e) =>
            (root = update((c) => {
              c[pref.key].type = e.target.value
              return c
            }))}
        >
          <option value="grow">Grow</option>
          <option value="fixed">Fixed</option>
          <option value="content">Content</option>
        </select>

        {#if selectedComponent[pref.key].type !== 'content'}
          <input
            type="number"
            value={selectedComponent[pref.key].value}
            on:change={(e) =>
              (root = update((c) => {
                c[pref.key].value = Number(e.target.value)
                return c
              }))}
          />
        {/if}
      {/if}
    </div>
  {:else}
    Selected item does not have any prefs
  {/each}
{/if}

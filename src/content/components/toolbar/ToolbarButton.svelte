<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  export let disabled = false
  export let button: HTMLButtonElement | undefined = undefined
</script>

<button class="toolbar__button" bind:this={button} on:click {disabled}>
  <slot />
</button>

<style>
  .toolbar__button {
    border: none;
    background: none;

    margin: 0;
    border-radius: 0.5rem;
    width: 2.5rem;
    height: 2.5rem;
  }

  .toolbar__button:hover:not(:disabled) {
    background: var(--surface-1);
  }
</style>

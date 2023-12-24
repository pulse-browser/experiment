<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  export let disabled = false
  export let button: HTMLButtonElement | undefined = undefined
  export let kind: 'toolbar' | 'page-icon' = 'toolbar'
  export let tooltip: string | undefined = undefined
</script>

<button
  class={`toolbar__button toolbar__button--${kind}`}
  bind:this={button}
  on:click
  {disabled}
  title={tooltip}
>
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

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .toolbar__button--page-icon {
    width: 2rem;
    height: 2rem;
    border-radius: 0.25rem;
    padding: 0;
  }

  .toolbar__button:hover:not(:disabled) {
    background: var(--surface-1);
  }
</style>

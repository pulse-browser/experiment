<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  export let zoom: number
</script>

{#if zoom != 1}
  <button on:click>
    {Math.round(zoom * 100)}%
  </button>
{/if}

<style>
  button {
    background: var(--surface);
    border: none;
    cursor: pointer;
    border-radius: 0.25rem;
    height: 2rem;
    margin-right: 0.125rem;
  }

  button:hover {
    background: var(--surface-1);
  }
</style>

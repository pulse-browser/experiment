<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  export let pref: string
  let value: string = Services.prefs.getStringPref(pref, '')
</script>

<div class="pref">
  <div class="pref__label"><slot /></div>
  <!-- svelte-ignore missing-declaration -->
  <input
    bind:value
    type="text"
    class="pref__value"
    on:keyup={() => Services.prefs.setStringPref(pref, value)}
  />
</div>

<style>
  .pref {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pref__label {
    font-weight: 700;
  }

  .pref__value {
    border: none;
    background-color: var(--surface-1);
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
  }
</style>

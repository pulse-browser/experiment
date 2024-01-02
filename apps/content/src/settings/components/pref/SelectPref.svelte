<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import FancySelect from '../../../shared/components/FancySelect.svelte'

  export let items: { icon: string; value: string; label: string }[]
  export let pref: string
  export let defaultValue: string

  let value: string = Services.prefs.getStringPref(pref, defaultValue)
  $: Services.prefs.setStringPref(pref, value)
</script>

<div class="pref">
  <div class="pref__label"><slot /></div>
  <!-- svelte-ignore missing-declaration -->
  <FancySelect {items} bind:selected={value} />
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
</style>

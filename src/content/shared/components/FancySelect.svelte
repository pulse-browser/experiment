<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import { onMount } from 'svelte'

  export let items: { icon: string; value: string; label: string }[]
  export let selected: string

  let menulist: any

  onMount(
    () =>
      (menulist.selectedIndex = items.findIndex(
        (item) => item.value == selected,
      )),
  )
  $: menulist &&
    (menulist.selectedIndex = items.findIndex((item) => item.value == selected))
</script>

<xul:menulist
  class="menulist"
  bind:this={menulist}
  on:command={(e) => {
    selected = e.target.value
  }}
>
  <xul:menupopup>
    {#each items as item}
      <xul:menuitem
        class="menuitem-iconic"
        label={item.label}
        value={item.value}
        image={item.icon}
      />
    {/each}
  </xul:menupopup>
</xul:menulist>

<style>
  .menulist::part(icon) {
    width: 1.5rem;
    height: 1.5rem;

    margin-right: 0.25rem;
  }

  .menuitem-iconic :global(.menu-iconic-left) {
    display: flex;
  }
</style>

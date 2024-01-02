<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import { onMount } from 'svelte'
  import { SidebarItemData } from './sidebar'

  export let title: string
  export let sidebarItems: SidebarItemData[]

  let container: HTMLDivElement

  onMount(() => {
    const sidebarItem = new SidebarItemData(container, title)
    sidebarItems.push(sidebarItem)

    return () =>
      (sidebarItems = sidebarItems.filter(
        (item) => item.counter != sidebarItem.counter,
      ))
  })
</script>

<div bind:this={container} class="category">
  <h2 class="category__title">{title}</h2>
  <slot />
</div>

<style>
  .category {
    margin-bottom: 4rem;
  }

  .category__title {
    font-size: 1.5rem;
    margin: 0;
  }
</style>

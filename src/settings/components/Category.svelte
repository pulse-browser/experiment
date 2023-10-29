<script lang="ts">
  import { onMount } from 'svelte'
  import { SidebarItemData } from './sidebar'

  export let title: string
  export let sidebarItems: SidebarItemData[]

  let container: HTMLDivElement

  onMount(() => {
    sidebarItems.push(new SidebarItemData(container, title))
  })
</script>

<div bind:this={container}>
  <h2>{title}</h2>

  <div class="testPadding" />
</div>

<style>
  .testPadding {
    height: 140vh;
  }
</style>

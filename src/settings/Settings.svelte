<script lang="ts">
  import Category from './components/Category.svelte'
  import { SidebarItemData, Sidebar } from './components/sidebar'

  let sidebarItems: SidebarItemData[] = []
  $: console.log(sidebarItems)
</script>

<Sidebar {sidebarItems} />
<div>
  <Category bind:sidebarItems title="Test Category" />
  <Category bind:sidebarItems title="Test Category 2" />
</div>

<style>
  :global(body) {
    display: flex;
  }
</style>

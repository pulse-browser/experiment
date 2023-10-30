<script lang="ts">
  import Category from './components/Category.svelte'
  import SubCategory from './components/SubCategory.svelte'
  import StringPref from './components/pref/StringPref.svelte'
  import { SidebarItemData, Sidebar } from './components/sidebar'

  let sidebarItems: SidebarItemData[] = []
  $: console.log(sidebarItems)
</script>

<Sidebar {sidebarItems} />

<div class="categories">
  <Category bind:sidebarItems title="Test Category" />
  <Category bind:sidebarItems title="Test Category 2" />
  <Category bind:sidebarItems title="Keybinds">
    <SubCategory title="Tabs & Websites">
      <StringPref pref="browser.keybinds.newTab">New Tab</StringPref>
    </SubCategory>
  </Category>
  <Category bind:sidebarItems title="Advanced">
    <iframe
      src="about:config"
      style="width: 100%; height: calc(100vh - 4rem); border: none"
    />
  </Category>
</div>

<style>
  :global(body) {
    display: flex;
  }

  .categories {
    padding: 2rem;
    flex-grow: 1;
  }

  .categories :global(div:last-child) {
    margin-bottom: 0;
  }
</style>

<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import Category from './components/Category.svelte'
  import SubCategory from './components/SubCategory.svelte'
  import StringPref from './components/pref/StringPref.svelte'
  import { SidebarItemData, Sidebar } from './components/sidebar'

  let sidebarItems: SidebarItemData[] = []
</script>

<Sidebar {sidebarItems} />

<div class="categories">
  <Category bind:sidebarItems title="Home">
    <SubCategory title="New Windows & Tabs">
      <StringPref pref="browser.newwindow.default">Window page</StringPref>
      <StringPref pref="browser.newtab.default">New tab page</StringPref>
    </SubCategory>
  </Category>

  <Category bind:sidebarItems title="Keybinds">
    <SubCategory title="Browser">
      <StringPref pref="browser.keybinds.toolbox">
        Open browser toolbox
      </StringPref>
      <StringPref pref="browser.keybinds.chrome.reload">
        Reload browser chrome
      </StringPref>
    </SubCategory>

    <SubCategory title="Tabs & Websites">
      <StringPref pref="browser.keybinds.newTab">New Tab</StringPref>
      <StringPref pref="browser.keybinds.closeTab">Close Active Tab</StringPref>
      <StringPref pref="browser.keybinds.nextTab">Next tab</StringPref>
      <StringPref pref="browser.keybinds.previousTab">Previous Tab</StringPref>

      {#each [1, 2, 3, 4, 5, 6, 7, 8] as tabNum}
        <StringPref pref={`browser.keybinds.tab${tabNum}`}
          >Jump to tab {tabNum}</StringPref
        >
      {/each}
      <StringPref pref="browser.keybinds.findInPage">Find In Page</StringPref>
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

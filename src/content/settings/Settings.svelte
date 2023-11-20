<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import {
    DEFAULT_SEARCH_ENGINE,
    SEARCH_ENGINE_PREF,
  } from '../shared/search/constants'
  import Category from './components/Category.svelte'
  import SubCategory from './components/SubCategory.svelte'
  import {
    ContextMenuPref,
    SelectPref,
    StringPref,
    CustomizableUiPref,
  } from './components/pref'
  import { SidebarItemData, Sidebar } from './components/sidebar'

  let sidebarItems: SidebarItemData[] = []
  const searchEngines: Promise<any[]> = import('../shared/search/engine').then(
    (search) => search.searchEngineService.getSearchEngines(),
  )
</script>

<Sidebar {sidebarItems} />

<div class="categories">
  <Category bind:sidebarItems title="Home">
    <SubCategory title="New Windows & Tabs">
      <StringPref pref="browser.newwindow.default">Window page</StringPref>
      <StringPref pref="browser.newtab.default">New tab page</StringPref>
    </SubCategory>
  </Category>

  <Category bind:sidebarItems title="Search">
    <SubCategory title="Default Search Engine">
      {#await searchEngines then searchEngines}
        <SelectPref
          items={searchEngines.map((engine) => ({
            value: engine._extensionID,
            label: engine._name,
            icon: engine.iconURI.spec,
          }))}
          pref={SEARCH_ENGINE_PREF}
          defaultValue={DEFAULT_SEARCH_ENGINE}>Default search engine</SelectPref
        >
      {/await}
    </SubCategory>
  </Category>

  <Category bind:sidebarItems title="Layout">
    <SubCategory title="Customizable UI">
      <CustomizableUiPref />
    </SubCategory>
    <SubCategory title="Context Menu">
      <ContextMenuPref pref="browser.contextmenus.page" />
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
      title="Advanced settings"
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

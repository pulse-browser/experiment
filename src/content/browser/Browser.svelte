<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import Browser from './components/Browser.svelte'
  import BrowserContextMenu from './components/contextMenus/BrowserContextMenu.svelte'
  import Keybindings from './components/keybindings/Keybindings.svelte'
  import Tab from './components/tabs/Tab.svelte'
  import Toolbar from './components/toolbar/Toolbar.svelte'

  import { tabs, openTab, selectedTab } from './lib/globalApi'

  $: currentTab = $tabs.find((tab) => tab.getId() == $selectedTab)
  // We don't care about the order that browers are rendered in the dom, but we
  // want to allow tab reordering. This should stop unnessisary updates
  $: sortedBrowers = [...$tabs].sort(
    (tabA, tabB) => tabA.getId() - tabB.getId()
  )
</script>

<div class="content">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="tabs" on:drop|preventDefault>
    {#each $tabs as tab (tab.getId())}
      <Tab {tab} bind:selectedTab={$selectedTab} />
    {/each}
    <button on:click={() => openTab()} class="tabs__button">
      <i class="ri-add-line ri-lg" />
    </button>
  </div>

  {#if currentTab}
    <Toolbar tab={currentTab} />
  {/if}

  <div class="browsers">
    {#each sortedBrowers as tab (tab.getId())}
      <Browser
        {tab}
        selectedTab={$selectedTab}
        on:constructed={(_) => {
          if ($selectedTab == -1) selectedTab.set(tab.getId())
        }}
      />
    {/each}
  </div>
</div>

<BrowserContextMenu />
<Keybindings />

<style>
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .tabs {
    display: flex;
    gap: 0.25rem;
  }

  .tabs__button {
    border: none;
    background: none;
    margin: 0.25rem 0;
    border-radius: 0.5rem;

    width: 2.5rem;
    height: 2.5rem;
  }

  .tabs__button:hover {
    background: var(--surface);
  }

  .browsers {
    flex-grow: 1;
  }
</style>

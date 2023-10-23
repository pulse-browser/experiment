<script lang="ts">
  import Browser from './components/Browser.svelte'
  import Tab from './components/tabs/Tab.svelte'
  import { initDevTools } from './lib/devtools'
  import { tabs, openTab } from './lib/globalApi'

  let selectedTab = -1
</script>

<div class="content">
  <div class="toolbar">
    <button on:click={initDevTools}>Open dev tools</button>
    <button on:click={() => window.location.reload()}>Reload</button>
  </div>
  <div class="tabs">
    {#each $tabs as tab (tab.getId())}
      <Tab {tab} bind:selectedTab />
    {/each}

    <button on:click={() => openTab()} class="tabs__button">
      <i class="ri-add-line ri-lg" />
    </button>
  </div>
  <div class="browsers">
    {#each $tabs as tab (tab.getId())}
      <Browser
        {tab}
        {selectedTab}
        on:constructed={(_) => {
          if (selectedTab == -1) selectedTab = tab.getId()
        }}
      />
    {/each}
  </div>
</div>

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

<script lang="ts">
  import Browser from './components/Browser.svelte'
  import Tab from './components/tabs/Tab.svelte'
  import { Tab as TabData } from './components/tabs/tab'
  import { initDevTools } from './lib/devtools'
  import { resource } from './lib/resources'

  const tabs = [
    new TabData(resource.NetUtil.newURI('https://google.com')),
    new TabData(resource.NetUtil.newURI('https://google.com')),
  ]

  let selectedTab = -1
</script>

<div class="content">
  <div class="toolbar">
    <button on:click={initDevTools}>Open dev tools</button>
    <button on:click={() => window.location.reload()}>Reload</button>
    <button
      on:click={() =>
        tabs.push(new TabData(resource.NetUtil.newURI('https://google.com')))}
      >New Tab</button
    >
  </div>
  <div class="tabs">
    {#each tabs as tab}
      <Tab {tab} bind:selectedTab />
    {/each}
  </div>
  <div class="browsers">
    {#each tabs as tab}
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
  .browsers {
    flex-grow: 1;
  }
</style>

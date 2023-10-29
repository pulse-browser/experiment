<script lang="ts">
  import { resource } from '../../lib/resources'
  import type { Tab } from '../tabs/tab'
  import HamburgerMenu from './HamburgerMenu.svelte'
  import ToolbarButton from './ToolbarButton.svelte'

  export let tab: Tab
  let inputContent: string = ''

  $: uri = tab.uri
  $: canGoBack = tab.canGoBack
  $: canGoForward = tab.canGoForward

  const unbindedSetInputContent = (value: string) => (inputContent = value)
  $: unbindedSetInputContent($uri.asciiSpec)
</script>

<div class="toolbar">
  <ToolbarButton disabled={!$canGoBack} on:click={() => tab.goBack()}>
    <i class="ri-arrow-left-line" />
  </ToolbarButton>
  <ToolbarButton on:click={() => tab.reload()}>
    <i class="ri-refresh-line" />
  </ToolbarButton>
  <ToolbarButton disabled={!$canGoForward} on:click={() => tab.goForward()}>
    <i class="ri-arrow-right-line" />
  </ToolbarButton>

  <div class="toolbar__spacer" />

  <input
    class="toolbar__urlbar"
    type="text"
    bind:value={inputContent}
    on:keydown={(e) => {
      console.log(e)
      if (e.key === 'Enter') tab.goToUri(resource.NetUtil.newURI(inputContent))
    }}
  />

  <div class="toolbar__spacer" />

  <HamburgerMenu />
</div>

<style>
  .toolbar {
    display: flex;
    align-items: center;

    background: var(--surface);
    padding: 0.125rem 0.25rem;
  }

  .toolbar * {
    border: none;
    background: none;
  }

  .toolbar__urlbar {
    flex-grow: 1;
    border-radius: 0.5rem;
    height: 2.5rem;
    padding: 0 1rem;
    background: var(--base);
  }

  .toolbar__urlbar:focus {
    outline: solid var(--active-border);
  }

  .toolbar__spacer {
    flex-grow: 1;
  }
</style>

<script lang="ts">
  import type { Tab } from './tab'
  import { closeTab } from '../../lib/globalApi'

  export let tab: Tab
  export let selectedTab: number

  const { title, icon } = tab

  $: tab.getId() == selectedTab && (document.title = $title)
</script>

<div
  on:click={() => (selectedTab = tab.getId())}
  on:mouseup={(e) => {
    // When the middle mouse button is clicked, close this tab
    if (e.button == 1) closeTab(tab)
  }}
  class="tab"
  aria-selected={tab.getId() == selectedTab}
>
  <img class="tab__icon" src={$icon} />
  <span>{$title}</span>
  <button class="tab__close" on:click={() => closeTab(tab)}>
    <i class="ri-close-line" />
  </button>
</div>

<style>
  .tab {
    padding: 0.25rem 1rem;
    margin: 0.25rem 0;
    font-size: 1.25rem;
    border-radius: 0.5rem;

    display: flex;
    align-items: center;

    cursor: pointer;
  }

  .tab[aria-selected='true'] {
    background: var(--surface-1) !important;
    padding-right: 0.25rem;
  }

  .tab[aria-selected='false'] .tab__close {
    display: none;
  }

  .tab:hover {
    background: var(--surface-0);
  }

  .tab__close {
    background: none;
    border: none;
    margin-left: 0.5rem;
    padding: 0;
    border-radius: 0.25rem;

    width: 2rem;
    height: 2rem;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
  }

  .tab__close:hover {
    background: var(--surface-2);
  }

  .tab__icon {
    height: 1.5rem;
    width: 1.5rem;
    margin-right: 0.5rem;
  }
</style>

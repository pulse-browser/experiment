<script lang="ts">
  import type { Tab } from './tab'

  export let tab: Tab
  export let selectedTab: number

  const { title, icon } = tab
</script>

<div on:click={() => (selectedTab = tab.getId())}>
  <img src={$icon} />
  <span>{$title}</span>
</div>

<script lang="ts">
  import type { Tab } from './tab'

  export let tab: Tab
  export let selectedTab: number
</script>

<div on:click={() => (selectedTab = tab.getId())}>
  <span>{tab.title}</span>
</div>

<script lang="ts">
  import type { Tab } from './tab'

  export let tab: Tab
  export let selectedTab: number

  const { title } = tab
</script>

<div on:click={() => (selectedTab = tab.getId())}>
  <span>{$title}</span>
</div>

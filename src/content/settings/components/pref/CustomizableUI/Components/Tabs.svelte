<script>
  export let verbose = false
</script>

{#if verbose}
  Tabs
{:else}
  <div class="tab active">Tab 1</div>
  <div class="tab">Tab 2</div>
{/if}

<style>
  .tab {
    padding: 0.25rem 1rem;
    border-radius: 0.25rem;
  }

  .tab.active {
    background-color: var(--surface-1) !important;
  }
</style>

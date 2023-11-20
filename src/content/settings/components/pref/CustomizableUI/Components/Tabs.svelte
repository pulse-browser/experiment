<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

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

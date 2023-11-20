<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  export let verbose: boolean
</script>

<div style:width="5rem" style:height="2rem">
  {#if verbose}
    Block
  {/if}
</div>

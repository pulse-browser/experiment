<script lang="ts">
  export let verbose: boolean
</script>

<div style:width="5rem" style:height="2rem">
  {#if verbose}
    Block
  {/if}
</div>

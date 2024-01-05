<script lang="ts">
  export let zoom: number
</script>

{#if zoom != 1}
  <button on:click>
    {Math.round(zoom * 100)}%
  </button>
{/if}

<style>
  button {
    background: var(--surface);
    border: none;
    cursor: pointer;
    border-radius: 0.25rem;
    height: 2rem;
    margin-right: 0.125rem;
  }

  button:hover {
    background: var(--surface-1);
  }
</style>

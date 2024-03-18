<script>
  export let disabled = false
</script>

<button on:click {disabled}>
  <slot />
</button>

<style>
  button {
    border: none;
    background: none;

    width: 2.5rem;
    height: 2.5rem;

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>


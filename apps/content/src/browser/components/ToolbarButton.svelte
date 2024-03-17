<script>
  export let disabled = false
</script>

<button on:click {disabled}>
  <slot />
</button>

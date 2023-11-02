<script context="module">
  let gId = 0
</script>

<script lang="ts">
  const id = gId++

  $: labelId = `text-input-${id}`
</script>

<div class="text-input__container">
  <label class="text-input__label" for={labelId}><slot /></label>
  <input type="text" class="text-input" id={labelId} />
</div>

<style>
  .text-input__label {
    display: block;
  }

  .text-input {
    display: block;
    margin: 0;
    border: none;

    border-radius: 0.5rem;
    padding: 0.5rem 1rem;

    --surface-level: 1;
    background-color: var(--surface-1);
  }

  .text-input:focus {
    outline: solid var(--active);
  }
</style>

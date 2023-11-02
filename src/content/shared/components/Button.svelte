<script lang="ts">
  import type { ButtonKind } from '.'

  export let kind: ButtonKind = 'primary'
</script>

<button on:click class={`button ${kind}`}><slot /></button>

<style>
  .button {
    border: none;
    padding: 0.5rem 1rem;

    color: var(--text);
    border-radius: 0.5rem;
  }

  .button.primary {
    color: var(--base);
    background-color: var(--active);
  }

  .button.primary:hover {
    background-color: color-mix(in srgb, var(--active) 80%, white);
  }

  .button.secondary {
    color: var(--text);
    background-color: var(--surface-1);
  }

  .button.secondary:hover {
    background-color: var(--surface-2);
  }
</style>

<script lang="ts">
  export let title: string
</script>

<h3 class="subcategory__title">{title}</h3>
<div class="subcategory">
  <slot />
</div>

<style>
  .subcategory {
    background-color: var(--surface);
    padding: 2rem;
    border-radius: 1rem;
  }

  .subcategory__title {
    font-weight: normal;
    font-size: 1rem;
    color: var(--subtext);

    margin-bottom: 0.75rem;
    margin-top: 2rem;
  }
</style>

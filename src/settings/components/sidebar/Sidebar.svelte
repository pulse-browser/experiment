<script lang="ts">
  import { onMount } from 'svelte'
  import { SidebarItemData } from './sidebar'

  export let sidebarItems: SidebarItemData[]
  let active: string[] = []
  let observer: IntersectionObserver

  onMount(() => {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const id = entry.target.getAttribute('id')
        if (!id) continue

        if (entry.intersectionRatio > 0) active = [...active, id]
        else active = active.filter((item) => item != id)
      }
    })
  })

  $: sidebarItems.forEach((item) => item.addObserver(observer))
</script>

<div class="sidebar">
  <nav class="items">
    {#each sidebarItems as sidebarItem}
      <a
        href={`#${sidebarItem.id}`}
        class={active.includes(sidebarItem.id) ? 'active' : ''}
      >
        {sidebarItem.title}
      </a>
    {/each}
  </nav>
</div>

<style>
  .sidebar {
    padding: 2rem;

    background: var(--surface);
  }

  .items {
    position: sticky;
    top: 2rem;

    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .items a {
    text-decoration: none;
    color: var(--text);

    padding: 0.25rem 1rem;
    border-radius: 0.5rem;

    min-width: 12rem;
  }

  .items a.active {
    color: var(--active-border);
    background: color-mix(in srgb, var(--active-border) 20%, transparent);
  }
</style>

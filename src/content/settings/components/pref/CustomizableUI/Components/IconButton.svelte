<script lang="ts">
  import ToolbarButton from '@shared/components/ToolbarButton.svelte'
  import type { ComponentId, IconComponent } from '@shared/customizableUI'

  export let component: ComponentId & IconComponent
</script>

<ToolbarButton kind="page-icon">
  <i class={`ri-${component.icon}`} />
</ToolbarButton>

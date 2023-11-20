<script lang="ts">
  import type {
    Component,
    ComponentId,
    SpacerComponent,
  } from '@shared/customizableUI'
  import UiItemBase from './UIItemBase.svelte'

  export let component: ComponentId & SpacerComponent
  export let root: Component
</script>

<UiItemBase {component} {root} />

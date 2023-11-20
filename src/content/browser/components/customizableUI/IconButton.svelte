<script lang="ts">
  import type {
    ComponentId,
    IconComponent,
    Component,
  } from '@shared/customizableUI'
  import type { Tab } from '../tabs/tab'
  import { ToolbarButton } from '@shared/components'
  import UIItemBase from './UIItemBase.svelte'

  export let component: ComponentId & IconComponent
  export let root: Component
  export let tab: Tab

  $: console.log(component)
  $: enabled = component.enabled(tab)
</script>

<UIItemBase {component} {root}>
  <ToolbarButton disabled={!$enabled} on:click={() => component.action(tab)}>
    <i class={`ri-${component.icon}`} />
  </ToolbarButton>
</UIItemBase>

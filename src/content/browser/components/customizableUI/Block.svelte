<script lang="ts">
  import type {
    BlockComponent,
    Component,
    ComponentId,
  } from '@shared/customizableUI'
  import type { Tab } from '../tabs/tab'

  import UiItemBase from './UIItemBase.svelte'
  import CustomizableUi from './CustomizableUI.svelte'

  export let component: ComponentId & BlockComponent
  export let root: Component
  export let tab: Tab
</script>

<UiItemBase {component} {root}>
  {#each component.content as child}
    <CustomizableUi component={child} {tab} {root} />
  {/each}
</UiItemBase>

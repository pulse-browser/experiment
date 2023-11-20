<script lang="ts">
  import type {
    Component,
    ComponentId,
    OmniboxComponent,
  } from '@shared/customizableUI'
  import type { Tab } from '../tabs/tab'

  import UiItemBase from './UIItemBase.svelte'
  import Omnibox from '../omnibox/Omnibox.svelte'

  export let component: ComponentId & OmniboxComponent
  export let root: Component

  export let tab: Tab
</script>

<UiItemBase {component} {root}>
  <Omnibox {tab} />
</UiItemBase>

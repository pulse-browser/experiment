<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type {
    BlockComponent,
    Component,
    ComponentId,
  } from '@shared/customizableUI'
  import type { Tab } from '@browser/lib/window/tab'

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

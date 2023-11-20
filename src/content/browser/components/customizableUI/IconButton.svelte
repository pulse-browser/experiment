<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

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

  let button: HTMLButtonElement | undefined

  $: enabled = component.enabled(tab)
</script>

<UIItemBase {component} {root}>
  <ToolbarButton
    bind:button
    disabled={!$enabled}
    on:click={() => component.action(tab, button)}
  >
    <i class={`ri-${component.icon}`} />
  </ToolbarButton>
</UIItemBase>

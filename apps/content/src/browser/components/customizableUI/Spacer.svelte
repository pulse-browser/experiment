<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

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

<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import ToolbarButton from '@shared/components/ToolbarButton.svelte'
  import type { ComponentId, IconComponent } from '@shared/customizableUI'

  export let component: ComponentId & IconComponent
</script>

<ToolbarButton kind="page-icon">
  <i class={`ri-${component.icon}`} />
</ToolbarButton>

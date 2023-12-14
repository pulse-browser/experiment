<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type { PageAction } from 'resource://app/modules/EPageActions.sys.mjs'
  import ToolbarButton from '@shared/components/ToolbarButton.svelte'

  export let pageAction: PageAction
</script>

<ToolbarButton kind="page-icon">
  <i class="ri-puzzle-line"></i>
</ToolbarButton>

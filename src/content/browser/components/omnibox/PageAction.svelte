<script lang="ts">
  import type { PageAction } from 'resource://app/modules/EPageActions.sys.mjs'
  import ToolbarButton from '@shared/components/ToolbarButton.svelte'

  export let pageAction: PageAction
</script>

<ToolbarButton kind="page-icon">
  <i class="ri-puzzle-line"></i>
</ToolbarButton>

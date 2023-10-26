<script lang="ts">
  import { browserContextMenuInfo } from '../../lib/globalApi'
  import { getClipboardHelper } from '../../lib/xul/ccWrapper'

  $: textSelection = $browserContextMenuInfo.textSelection
</script>

<xul:menupopup id="browser_context_menu">
  <xul:menuitem label={'Test'} />
  {#if textSelection}
    <xul:menuitem
      label={'Copy'}
      on:command={() => {
        const clipboardHelper = getClipboardHelper()
        clipboardHelper.copyString(textSelection)
      }}
    />
  {/if}
</xul:menupopup>

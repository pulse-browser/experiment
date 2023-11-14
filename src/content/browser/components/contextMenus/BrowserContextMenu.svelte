<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

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
        if (textSelection) clipboardHelper.copyString(textSelection, 0)
      }}
    />
  {/if}
</xul:menupopup>

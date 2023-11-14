<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import {
    browserContextMenuInfo,
    openTab,
    setCurrentTab,
  } from '../../lib/globalApi'
  import { resource } from '../../lib/resources'
  import { getClipboardHelper } from '../../lib/xul/ccWrapper'

  $: textSelection = $browserContextMenuInfo.textSelection
  $: href = $browserContextMenuInfo.href
</script>

<xul:menupopup id="browser_context_menu">
  <xul:menuitem label={'Test'} />
  {#if href}
    <xul:menuitem
      label="Open link in new tab"
      on:command={() => {
        const tab = openTab(resource.NetUtil.newURI(href))
        if (Services.prefs.getBoolPref('browser.tabs.newTabFocus', false)) {
          queueMicrotask(() => setCurrentTab(tab))
        }
      }}
    />
    <xul:menuitem
      label="Copy link location"
      on:command={() => {
        const clipboardHelper = getClipboardHelper()
        if (href) clipboardHelper.copyString(href, 0)
      }}
    />
  {/if}
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

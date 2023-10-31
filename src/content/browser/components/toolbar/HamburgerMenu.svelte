<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import { initDevTools } from '../../lib/devtools'
  import HamburgerMenuItem from './HamburgerMenuItem.svelte'
  import ToolbarButton from './ToolbarButton.svelte'

  let panel: any
  let button: any
</script>

<!-- Positioning docs: https://udn.realityripple.com/docs/Archive/Mozilla/XUL/PopupGuide/Positioning  --->
<ToolbarButton
  on:click={() => panel.openPopup(button, 'bottomright topright')}
  bind:button
>
  <i class="ri-menu-line" />
</ToolbarButton>

<xul:panel bind:this={panel} class="panel">
  <div class="panel__container">
    <HamburgerMenuItem
      on:click={() =>
        Services.ww.openWindow(
          window,
          'chrome://browser/content/settings/index.html',
          '_blank',
          'chrome,dialog=yes,all',
          null
        )}
    >
      Settings
    </HamburgerMenuItem>
    <HamburgerMenuItem on:click={initDevTools}>
      Open Dev Tools
    </HamburgerMenuItem>
    <HamburgerMenuItem on:click={() => window.location.reload()}>
      Reload
    </HamburgerMenuItem>
  </div>
</xul:panel>

<style>
  .panel {
    border-radius: 0.5rem;
  }

  .panel__container {
    display: flex;
    flex-direction: column;

    gap: 0.5rem;
    padding: 0.5rem;
    margin: -0.25rem 0;
  }
</style>

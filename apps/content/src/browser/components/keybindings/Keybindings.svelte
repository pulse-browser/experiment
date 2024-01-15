<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import { initDevTools } from '@browser/lib/devtools'
  import Keybinding from './Keybinding.svelte'
  import {
    openTab,
    runOnCurrentTab,
    closeTab,
    setCurrentTabIndex,
    getCurrentTabIndex,
  } from '@browser/lib/window/tabs'
</script>

<xul:keyset>
  <!-- Browser --->
  <Keybinding
    pref="browser.keybinds.toolbox"
    on:command={() => initDevTools()}
  />
  <Keybinding
    pref="browser.keybinds.chrome.reload"
    on:command={() => window.location.reload()}
  />

  <!-- Tabs & Websites --->
  <Keybinding
    pref="browser.keybinds.newWindow"
    on:command={() => window.windowApi.window.new()}
  />
  <Keybinding pref="browser.keybinds.newTab" on:command={() => openTab()} />
  <Keybinding
    pref="browser.keybinds.closeTab"
    on:command={() => runOnCurrentTab(closeTab)}
  />
  <Keybinding
    pref="browser.keybinds.refreshTab"
    on:command={() => runOnCurrentTab((tab) => tab.reload())}
  />
  <Keybinding
    pref="browser.keybinds.nextTab"
    on:command={() => setCurrentTabIndex(getCurrentTabIndex() + 1)}
  />
  <Keybinding
    pref="browser.keybinds.previousTab"
    on:command={() => setCurrentTabIndex(getCurrentTabIndex() - 1)}
  />

  <Keybinding
    pref="browser.keybinds.zoomIn"
    on:command={() =>
      runOnCurrentTab((tab) => tab.zoom.update((zoom) => zoom + 0.1))}
  />
  <Keybinding
    pref="browser.keybinds.zoomOut"
    on:command={() =>
      runOnCurrentTab((tab) => tab.zoom.update((zoom) => zoom - 0.1))}
  />
  <Keybinding
    pref="browser.keybinds.zoomReset"
    on:command={() => runOnCurrentTab((tab) => tab.zoom.set(1))}
  />

  {#each [1, 2, 3, 4, 5, 6, 7, 8] as tabNum}
    <Keybinding
      pref={`browser.keybinds.tab${tabNum}`}
      on:command={() => setCurrentTabIndex(tabNum - 1)}
    />
  {/each}
  <Keybinding
    pref={`browser.keybinds.findInPage`}
    on:command={() => runOnCurrentTab((tab) => tab.showFindBar())}
  />
</xul:keyset>

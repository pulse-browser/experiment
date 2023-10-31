<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script>
  import { initDevTools } from '../../lib/devtools'
  import {
    closeTab,
    openTab,
    runOnCurrentTab,
    setCurrentTabIndex,
    getCurrentTabIndex,
  } from '../../lib/globalApi'
  import Keybinding from './Keybinding.svelte'
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
  <Keybinding pref="browser.keybinds.newTab" on:command={() => openTab()} />
  <Keybinding
    pref="browser.keybinds.closeTab"
    on:command={() => runOnCurrentTab(closeTab)}
  />
  <Keybinding
    pref="browser.keybinds.nextTab"
    on:command={() => setCurrentTabIndex(getCurrentTabIndex() + 1)}
  />
  <Keybinding
    pref="browser.keybinds.previousTab"
    on:command={() => setCurrentTabIndex(getCurrentTabIndex() - 1)}
  />
  {#each [1, 2, 3, 4, 5, 6, 7, 8] as tabNum}
    <Keybinding
      pref={`browser.keybinds.tab${tabNum}`}
      on:command={() => setCurrentTabIndex(tabNum - 1)}
    />
  {/each}
</xul:keyset>


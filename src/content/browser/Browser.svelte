<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import { customizableUIDynamicPref } from '@shared/customizableUI'
  import BrowserContextMenu from './components/contextMenus/BrowserContextMenu.svelte'
  import CustomizableUi from './components/customizableUI/CustomizableUI.svelte'
  import Keybindings from './components/keybindings/Keybindings.svelte'
  import { tabs, selectedTab } from './lib/globalApi'

  let component = customizableUIDynamicPref('browser.uiCustomization.state')
  $: currentTab = $tabs.find((tab) => tab.getId() == $selectedTab)
  $: console.log($component, currentTab)
</script>

{#if currentTab}
  <CustomizableUi component={$component} root={$component} tab={currentTab} />
{/if}

<BrowserContextMenu />
<Keybindings />

<style>
  /* The root component must be specified to be full height */
  :global(body > .component) {
    height: 100%;
  }
</style>

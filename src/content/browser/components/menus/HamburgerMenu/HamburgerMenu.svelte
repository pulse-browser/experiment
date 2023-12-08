<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import { initDevTools } from '@browser/lib/devtools'
  import { resource } from '@browser/lib/resources'

  import HamburgerMenuItem from './HamburgerMenuItem.svelte'
  import { openTab } from '@browser/lib/window/tabs'

  const openDialogWindowAction = (url: string) => () =>
    Services.ww.openWindow(window, url, '_blank', 'chrome,dialog=yes,all', null)

  const openChromeWindowAction = (url: string) => () =>
    Services.ww.openWindow(null, url, '_blank', 'chrome,dialog=no,all', null)
</script>

<xul:panel class="panel" id="hamburgerMenu">
  <div class="panel__container">
    <HamburgerMenuItem
      on:click={openChromeWindowAction(
        Services.prefs.getStringPref('app.content'),
      )}
    >
      New Window
    </HamburgerMenuItem>

    <HamburgerMenuItem
      on:click={openDialogWindowAction(
        'chrome://browser/content/settings/index.html',
      )}
    >
      Settings
    </HamburgerMenuItem>
    <HamburgerMenuItem
      on:click={openDialogWindowAction(
        'chrome://browser/content/bookmarks/index.html',
      )}
    >
      Bookmarks
    </HamburgerMenuItem>
    <HamburgerMenuItem
      on:click={openDialogWindowAction(
        'chrome://browser/content/history/index.html',
      )}
    >
      History
    </HamburgerMenuItem>
    <HamburgerMenuItem
      on:click={() =>
        openTab(
          resource.NetUtil.newURI(
            'chrome://browser/content/credits/index.html',
          ),
        )}
    >
      Credits
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

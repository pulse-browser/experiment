<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, import { browserContextMenuInfo } from '@browser/lib/tabs';
 - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

<script lang="ts">
  import type { MenuItem } from '@shared/contextMenus'
  import { resolverStore } from '@shared/svelteUtils'
  import {
    browserContextMenuInfo,
    type ContextMenuInfo,
  } from '@browser/lib/window/contextMenu'

  const contextMenusModule = import('@shared/contextMenus')
  const menuItems = resolverStore(
    [],
    contextMenusModule.then(({ getMenuItemsDynamicPref }) =>
      getMenuItemsDynamicPref('browser.contextmenus.page'),
    ),
  )

  function shouldHideSeparator(
    index: number,
    menuItems: MenuItem[],
    context: ContextMenuInfo,
  ) {
    const nextVisibleAbove = menuItems
      .slice(0, index)
      .reverse()
      .find((item) => item.type === 'separator' || item.visible(context))
    const nextVisibleBelow = menuItems
      .slice(index + 1)
      .find((item) => item.type === 'separator' || item.visible(context))

    return (
      !nextVisibleAbove ||
      !nextVisibleBelow ||
      nextVisibleAbove.type === 'separator' ||
      nextVisibleBelow.type === 'separator'
    )
  }
</script>

<xul:menupopup id="browser_context_menu">
  {#each $menuItems as menuItem, index}
    {#if menuItem.type === 'separator'}
      <xul:menuseparator
        hidden={shouldHideSeparator(index, $menuItems, $browserContextMenuInfo)}
      />
    {:else}
      <xul:menuitem
        label={menuItem.title}
        hidden={!menuItem.visible($browserContextMenuInfo)}
        on:command={() => menuItem.action($browserContextMenuInfo)}
      />
    {/if}
  {/each}
</xul:menupopup>

<script>
  import { openTab } from '../../lib/globalApi'
  import Keybinding from './Keybinding.svelte'
</script>

<xul:keyset>
  <Keybinding pref="browser.keybinds.newTab" on:command={() => openTab()} />
</xul:keyset>


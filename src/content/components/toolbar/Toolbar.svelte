<script lang="ts">
  import { resource } from '../../lib/resources'
  import type { Tab } from '../tabs/tab'

  export let tab: Tab
  let inputContent: string = ''

  const { uri } = tab

  const unbindedSetInputContent = (value: string) => (inputContent = value)
  $: unbindedSetInputContent($uri.asciiSpec)
</script>

<div class="toolbar">
  <input
    type="text"
    bind:value={inputContent}
    on:keydown={(e) => {
      console.log(e)
      if (e.key === 'Enter') tab.goToUri(resource.NetUtil.newURI(inputContent))
    }}
  />
</div>

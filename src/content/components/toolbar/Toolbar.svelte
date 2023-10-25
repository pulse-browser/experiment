<script lang="ts">
  import { resource } from '../../lib/resources'
  import type { Tab } from '../tabs/tab'

  export let tab: Tab
  let inputContent: string = ''

  const { uri, canGoBack, canGoForward } = tab

  const unbindedSetInputContent = (value: string) => (inputContent = value)
  $: unbindedSetInputContent($uri.asciiSpec)
</script>

<div class="toolbar">
  <button disabled={!$canGoBack} on:click={() => tab.goBack()}>
    <i class="ri-arrow-left-line" />
  </button>
  <button on:click={() => tab.reload()}>
    <i class="ri-refresh-line" />
  </button>
  <button disabled={!$canGoForward} on:click={() => tab.goForward()}>
    <i class="ri-arrow-right-line" />
  </button>

  <input
    type="text"
    bind:value={inputContent}
    on:keydown={(e) => {
      console.log(e)
      if (e.key === 'Enter') tab.goToUri(resource.NetUtil.newURI(inputContent))
    }}
  />
</div>

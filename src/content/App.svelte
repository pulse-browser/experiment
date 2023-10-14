<script lang="ts">
  import Browser from './components/Browser.svelte'
  import { initDevTools } from './lib/devtools'
  import { resource } from './lib/resources'
</script>

<h1>Hello world!</h1>
<button on:click={initDevTools}>Open dev tools</button>

<Browser url={resource.NetUtil.newURI('https://google.com')} />

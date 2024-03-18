<script>
  // @ts-check
  import WebsiteView from './components/WebsiteView.svelte'
  import * as WebsiteViewApi from './windowApi/WebsiteView.js'
  import { browserImports } from './browserImports.js'

  const lazy = {}
  ChromeUtils.defineESModuleGetters(lazy, {
    BrowserToolboxLauncher:
      'resource://devtools/client/framework/browser-toolbox/Launcher.sys.mjs',
  })

  const view = WebsiteViewApi.create(
    browserImports.NetUtil.newURI('https://google.com/'),
  )
</script>

<button on:click={() => lazy.BrowserToolboxLauncher.init()}
  >Open devtools</button
>

<WebsiteView {view} />

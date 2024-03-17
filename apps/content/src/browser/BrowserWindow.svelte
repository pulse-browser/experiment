<script>
  // @ts-check
  import BrowserView from './components/BrowserView.svelte'
  import * as WebsiteViewApi from './windowApi/WebsiteView.js'
  import { browserImports } from './browserImports.js'

  const lazy = {}
  ChromeUtils.defineESModuleGetters(lazy, {
    BrowserToolboxLauncher:
      'resource://devtools/client/framework/browser-toolbox/Launcher.sys.mjs',
  })

  const browserView = WebsiteViewApi.create(
    browserImports.NetUtil.newURI('https://google.com/'),
  )
</script>

<button on:click={() => lazy.BrowserToolboxLauncher.init()}
  >Open devtools</button
>

<BrowserView {browserView} />

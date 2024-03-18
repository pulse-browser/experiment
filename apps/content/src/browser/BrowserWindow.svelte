<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at http://mozilla.org/MPL/2.0/. -->

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
    browserImports.NetUtil.newURI('https://google.com'),
  )
</script>

<button on:click={() => lazy.BrowserToolboxLauncher.init()}
  >Open devtools</button
>
<button on:click={() => window.location.reload()}>Reload</button>

<WebsiteView {view} />

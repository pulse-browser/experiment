<script>
  // @ts-check

  const lazy = {}
  ChromeUtils.defineESModuleGetters(lazy, {
    BrowserToolboxLauncher:
      'resource://devtools/client/framework/browser-toolbox/Launcher.sys.mjs',
  })
</script>

<button on:click={() => lazy.BrowserToolboxLauncher.init()}
  >Open devtools</button
>

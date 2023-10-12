let lazy: any = {}
;(ChromeUtils as any).defineESModuleGetters(lazy, {
  BrowserToolboxLauncher:
    'resource://devtools/client/framework/browser-toolbox/Launcher.sys.mjs',
})

export const initDevTools = lazy.BrowserToolboxLauncher.init

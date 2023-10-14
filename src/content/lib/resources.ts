export let resource: {
  E10SUtils: typeof import('resource://gre/modules/E10SUtils.sys.mjs').E10SUtils
  NetUtil: typeof import('resource://gre/modules/NetUtil.sys.mjs').NetUtil
} = {} as any
;(ChromeUtils as any).defineESModuleGetters(resource, {
  E10SUtils: 'resource://gre/modules/E10SUtils.sys.mjs',
  NetUtil: 'resource://gre/modules/NetUtil.sys.mjs',
})

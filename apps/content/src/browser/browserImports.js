// @ts-check
import { lazyESModuleGetters } from '../shared/lazy.js'

export const browserImports = lazyESModuleGetters({
  E10SUtils: 'resource://gre/modules/E10SUtils.sys.mjs',
  NetUtil: 'resource://gre/modules/NetUtil.sys.mjs',
})

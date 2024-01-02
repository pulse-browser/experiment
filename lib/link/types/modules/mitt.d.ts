declare module 'resource://app/modules/mitt.sys.mjs' {
  export type * from 'mitt'

  const mitt: typeof import('mitt').default
  export default mitt
}

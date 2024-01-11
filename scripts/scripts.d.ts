declare module 'tap-spec' {
  import { Transform } from 'stream'

  declare type SpecOptions = {
    padding?: string
  }

  function tapSpec(spec?: SpecOptions): Transform
  export default tapSpec
}

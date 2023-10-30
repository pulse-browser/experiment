type ResultInner<Value, Error> =
  | { _type: 'value'; inner: Value }
  | { _type: 'error'; inner: Error }
export class Result<Value, Error> {
  inner: ResultInner<Value, Error>

  private constructor(inner: ResultInner<Value, Error>) {
    this.inner = inner
  }

  static ok<V, E>(value: V): Result<V, E> {
    return new Result<V, E>({ _type: 'value', inner: value })
  }

  static err<V, E>(error: E): Result<V, E> {
    return new Result<V, E>({ _type: 'error', inner: error })
  }

  /**
   * Returns the value or throws the error if it exists. You should only use this in testing code
   * @deprecated
   */
  unwrap(): Value {
    if (this.inner._type === 'error') {
      throw this.inner.inner
    }

    return this.inner.inner
  }
}

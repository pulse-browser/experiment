export type ObservableCallback = (
  subject: nsISupportsType,
  topic: string,
  data: string,
) => void

class ObservableImpl implements nsIObserverType {
  QueryInterface = ChromeUtils.generateQI(['nsIObserver'])
  observe: ObservableCallback

  constructor(cb: ObservableCallback) {
    this.observe = cb
  }
}

export function observable(callback: ObservableCallback): nsIObserverType {
  return new ObservableImpl(callback)
}

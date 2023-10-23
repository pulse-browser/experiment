import { writable, type Writable } from 'svelte/store'
import {
  createBrowser,
  getBrowserRemoteType,
  setURI,
} from '../../lib/xul/browser'
import { domContentLoaded } from '../../lib/xul/domevents'

let localTabId = 0

/**
 * This provides a consistent internal representation of a tab, including the browser elements
 * it contains & information derived from listeners about its current state
 */
export class Tab {
  private _id: number = ++localTabId
  private tabId: number | undefined

  private uri: nsIURIType
  private browserElement: HTMLElement

  public title = writable('...')
  public icon: Writable<string | null> = writable(null)

  constructor(uri: nsIURIType) {
    this.uri = uri
    this.browserElement = createBrowser({
      remoteType: getBrowserRemoteType(uri),
    })

    this.browserElement.addEventListener('pagetitlechanged', () => {
      this.title.set((this.browserElement as any).contentTitle)
    })
  }

  public getId(): number {
    return this._id
  }

  /**
   * Gecko's internal tab/browser id. Note that this is not always ready on first render, so
   * you should use {@link this.getId()} for keys etc
   */
  public getTabId(): number {
    return this.tabId || 0
  }

  public async setContainer(container: HTMLElement) {
    container.appendChild(this.browserElement)
    this.tabId = (this.browserElement as any).browserId as number

    // Load the URI once we are sure that the dom has fully loaded
    await domContentLoaded.promise
    setURI(this.browserElement, this.uri)
  }

  public destroy() {
    this.browserElement.remove()
  }
}

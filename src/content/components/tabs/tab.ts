import { writable } from 'svelte/store'
import {
  createBrowser,
  getBrowserRemoteType,
  setURI,
} from '../../lib/xul/browser'
import { domContentLoaded } from '../../lib/xul/domevents'

/**
 * This provides a consistent internal representation of a tab, including the browser elements
 * it contains & information derived from listeners about its current state
 */
export class Tab {
  private _id: number

  private uri: nsIURIType
  private browserElement: HTMLElement

  public title = writable('...')

  constructor(uri: nsIURIType) {
    this.uri = uri
    this.browserElement = createBrowser({
      remoteType: getBrowserRemoteType(uri),
    })

    this._id = (this.browserElement as any).browserId as number

    this.browserElement.addEventListener('pagetitlechanged', () => {
      this.title.set((this.browserElement as any).contentTitle)
    })
  }

  public getId(): number {
    return this._id
  }

  public async setContainer(container: HTMLElement) {
    container.appendChild(this.browserElement)
    this._id = (this.browserElement as any).browserId as number

    // Load the URI once we are sure that the dom has fully loaded
    await domContentLoaded.promise
    setURI(this.browserElement, this.uri)
  }

  public destroy() {
    this.browserElement.remove()
  }
}

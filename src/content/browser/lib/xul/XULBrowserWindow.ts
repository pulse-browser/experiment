/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

export class XULBrowserWindow {
  QueryInterface = ChromeUtils.generateQI([
    'nsIWebProgressListener',
    'nsIWebProgressListener2',
    'nsISupportsWeakReference',
    'nsIXULBrowserWindow',
  ])

  setOverLink(link: string): void {
    // TODO: Do something with information about link hover
  }
  onBeforeLinkTraversal(
    originalTarget: string,
    linkURI: nsIURIType,
    linkNode: Node,
    isAppTab: boolean,
  ): string {
    throw new Error('Method not implemented.')
  }
  showTooltip(
    x: number,
    y: number,
    tooltip: string,
    direction: string,
    browser: Element,
  ): void {
    // TODO: Implement link tooltips
  }
  hideTooltip(): void {
    // TODO: Implment link tooltips
  }
  getTabCount() {
    throw new Error('Method not implemented.')
  }
  onProgressChange64(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aCurSelfProgress: number,
    aMaxSelfProgress: number,
    aCurTotalProgress: number,
    aMaxTotalProgress: number,
  ): void {
    throw new Error('Method not implemented.')
  }
  onRefreshAttempted(
    aWebProgress: nsIWebProgressType,
    aRefreshURI: nsIURIType,
    aMillis: number,
    aSameURI: boolean,
  ): boolean {
    throw new Error('Method not implemented.')
  }
  onStateChange(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aStateFlags: number,
    aStatus: number,
  ): void {
    throw new Error('Method not implemented.')
  }
  onProgressChange(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aCurSelfProgress: number,
    aMaxSelfProgress: number,
    aCurTotalProgress: number,
    aMaxTotalProgress: number,
  ): void {
    throw new Error('Method not implemented.')
  }
  onLocationChange(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aLocation: nsIURIType,
    aFlags: number,
  ): void {
    throw new Error('Method not implemented.')
  }
  onStatusChange(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aStatus: number,
    aMessage: string,
  ): void {
    throw new Error('Method not implemented.')
  }
  onSecurityChange(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aState: number,
  ): void {
    throw new Error('Method not implemented.')
  }
  onContentBlockingEvent(
    aWebProgress: nsIWebProgressType,
    aRequest: nsIRequestType,
    aEvent: number,
  ): void {
    throw new Error('Method not implemented.')
  }
}

export const globalXULBrowserWindow = new XULBrowserWindow()

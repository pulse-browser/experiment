/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/no-unused-vars */

export enum OpenWhere {
  DefaultWindow = 0,
  CurrentWindow = 1,
  NewWindow = 2,
  NewTab = 3,
  PrintBrowser = 4,
}

export enum OpenFlags {
  New = 0x0,
  /** Open was triggered by a thirdparty application */
  External = 0x1,
  NoOpener = 0x4,
  NoReferer = 0x8,
}

export class NSBrowserAccess {
  createContentWindow(
    aURI: nsIURIType,
    aOpenWindowInfo: nsIOpenWindowInfoType,
    aWhere: number,
    aFlags: number,
    aTriggeringPrincipal: nsIPrincipalType,
    aCsp: nsIContentSecurityPolicyType,
  ) {
    throw new Error('Method not implemented.')
  }

  createContentWindowInFrame(
    aURI: nsIURIType,
    params: nsIOpenURIInFrameParamsType,
    aWhere: number,
  ): Element | null {
    if (aWhere !== OpenWhere.NewTab) {
      console.warn('NSBrowserAccess: Only OpenWhere.NewTab is supported')
      return null
    }

    // TODO: Handle params
    // TODO: Handle unhandled arguments (see nsIBrowserDOMWindow)
    const tab = window.windowApi.tabs.openTab(aURI)
    const browser = tab.getBrowserElement()
    return browser
  }

  openURI(
    aURI: nsIURIType,
    aOpenWindowInfo: nsIOpenWindowInfoType,
    aWhere: number,
    aFlags: number,
    aTriggeringPrincipal: nsIPrincipalType,
    aCsp: nsIContentSecurityPolicyType,
  ) {
    throw new Error('Method not implemented.')
  }
  openURIInFrame(
    aURI: nsIURIType,
    params: nsIOpenURIInFrameParamsType,
    aWhere: number,
    aFlags: number,
    aName: string,
  ): Element {
    throw new Error('Method not implemented.')
  }
  canClose(): boolean {
    // TODO: Logic
    return true
  }
  tabCount: number = 0

  QueryInterface = ChromeUtils.generateQI(['nsIBrowserDOMWindow'])
}

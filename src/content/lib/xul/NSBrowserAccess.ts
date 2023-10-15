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
    aFlags: number,
    aName: string,
  ): Element {
    throw new Error('Method not implemented.')
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
    throw new Error('Method not implemented.')
  }
  tabCount: number = 0

  QueryInterface = ChromeUtils.generateQI(['nsIBrowserDOMWindow'])
}

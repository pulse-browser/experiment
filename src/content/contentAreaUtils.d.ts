declare function urlSecurityCheck(
  url: string | nsIURIType,
  principal: nsIPrincipalType,
  flags?: number,
): void

declare function saveURL(
  url: string | nsIURIType,
  originalUrl: string,
  fileName: string,
  filePickerTitleKey: string,
  shouldBypassCache: boolean,
  aSkipPrompt: boolean,
  aReferrerInfo: nsIReferrerInfoType,
  aCookieJarSettings: nsICookieJarSettingsType,
  aSourceDocument,
  aIsContentWindowPrivate: boolean,
  aPrincipal: nsIPrincipalType,
)

declare function saveBrowser(
  aBrowser: XULBrowserElement,
  aSkipPrompt: boolean,
  aBrowsingContext = null,
)

declare function internalSave(
  aURL: string,
  aOriginalURL: string | null,
  aDocument,
  aDefaultFileName: string | null,
  aContentDisposition: string | null,
  aContentType: string | null,
  aShouldBypassCache: boolean | null,
  aFilePickerTitleKey: string | null,
  aChosenData,
  aReferrerInfo: nsIReferrerInfoType | null,
  aCookieJarSettings: nsICookieJarSettingsType | null,
  aInitiatingDocument?,
  aSkipPrompt?: boolean | null,
  aCacheKey?: string | null,
  aIsContentWindowPrivate?: boolean | null,
  aPrincipal?: nsIPrincipalType | null,
)

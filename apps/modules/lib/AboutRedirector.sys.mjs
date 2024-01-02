/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @ts-check
/// <reference types="@browser/link" />

/**
 * Based on Thunderbird's module with the same name
 * {@link https://searchfox.org/comm-central/source/mail/components/AboutRedirector.jsm}
 */
export class AboutRedirector {
  QueryInterface = ChromeUtils.generateQI(['nsIAboutModule'])

  /**
   * @type {Record<string, {url: string, flags: number}>}
   * @private
   */
  redirectMap = {
    certerror: {
      url: 'chrome://global/content/aboutNetError.xhtml',
      flags:
        Ci.nsIAboutModule.URI_SAFE_FOR_UNTRUSTED_CONTENT |
        Ci.nsIAboutModule.URI_CAN_LOAD_IN_CHILD |
        Ci.nsIAboutModule.ALLOW_SCRIPT |
        Ci.nsIAboutModule.HIDE_FROM_ABOUTABOUT,
    },
    tests: {
      url: 'chrome://browser/content/tests/index.html',
      flags: Ci.nsIAboutModule.ALLOW_SCRIPT,
    },
  }

  /**
   * Filters out hashes and query strings from the about url, returning just the name
   * @private
   * @param {nsIURIType} uri
   * @returns {string}
   */
  getRedirectName({ pathQueryRef }) {
    const [name] = /[^?#]+/.exec(pathQueryRef) || ['invalid']
    return name.toLowerCase()
  }

  /**
   * @private
   * @param {string} name The name of the missing page
   * @returns {never}
   */
  notRegistered(name) {
    throw new Error(`about:${name} was not registered with AboutRedirector`)
  }

  /**
   * @param {nsIURIType} uri
   * @param {nsILoadInfoType} loadInfo
   * @returns {nsIChannelType}
   */
  newChannel(uri, loadInfo) {
    const redirectName = this.getRedirectName(uri)
    const redirect = this.redirectMap[redirectName]
    if (!redirect) this.notRegistered(redirectName)

    const redirectUri = Services.io.newURI(redirect.url)
    const channel = Services.io.newChannelFromURIWithLoadInfo(
      redirectUri,
      loadInfo,
    )
    channel.originalURI = uri

    const safeForUntrustedContent =
      redirect.flags & Ci.nsIAboutModule.URI_SAFE_FOR_UNTRUSTED_CONTENT
    if (safeForUntrustedContent) {
      channel.owner = Services.scriptSecurityManager.createContentPrincipal(
        uri,
        {},
      )
    }

    return channel
  }

  /**
   * Fetches some combination of flags for some `about:` url
   * @param {nsIURIType} uri The url to get flags for
   * @returns {number} The assigned flags
   */
  getURIFlags(uri) {
    const redirectName = this.getRedirectName(uri)
    const redirect = this.redirectMap[redirectName]
    if (!redirect) this.notRegistered(redirectName)

    return redirect.flags
  }

  /**
   * Finds the uri for a paticular `about:` about
   * @param {nsIURIType} uri The url to match
   * @returns {nsIURIType} The page to redirect to
   */
  getChromeURI(uri) {
    const redirectName = this.getRedirectName(uri)
    const redirect = this.redirectMap[redirectName]
    if (!redirect) this.notRegistered(redirectName)

    return Services.io.newURI(redirect.url)
  }
}

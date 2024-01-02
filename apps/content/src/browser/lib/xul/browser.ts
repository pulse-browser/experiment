/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import { resource } from '../resources'

const { useRemoteTabs, useRemoteSubframe } = window.docShell.QueryInterface(
  Ci.nsILoadContext,
)

const DEFAULT_BROWSER_ATTRIBUTES = {
  message: 'true',
  messagemanagergroup: 'browsers',
  type: 'content',
  contextmenu: 'browser_context_menu',
} as const

export function setURI(browser: XULBrowserElement, uri: nsIURIType) {
  browser.source = uri.spec
  try {
    browser.loadURI(uri, {
      triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
      // remoteTypeOverride: getBrowserRemoteType(uri),
    })
  } catch (e) {
    console.log(browser, uri)
    console.error(e)
  }
}

export function getBrowserRemoteType(uri: nsIURIType) {
  const oa = resource.E10SUtils.predictOriginAttributes({ window })
  return resource.E10SUtils.getRemoteTypeForURI(
    uri.spec,
    useRemoteTabs,
    useRemoteSubframe,
    resource.E10SUtils.DEFAULT_REMOTE_TYPE,
    uri,
    oa,
  )
}

export function createBrowser({
  remoteType,
  attributes,
}: {
  remoteType?: string
  attributes?: {
    disableglobalhistory?: string
    messagemanagergroup?: string
    ['webextension-view-type']?: string
  }
} = {}): XULBrowserElement {
  const browser = document.createXULElement('browser')
  if (remoteType) {
    browser.setAttribute('remoteType', remoteType)
    browser.setAttribute('remote', true)
  }

  const mergedAttributes = {
    ...DEFAULT_BROWSER_ATTRIBUTES,
    ...(attributes || {}),
  }

  for (const attribute in mergedAttributes)
    browser.setAttribute(
      attribute,
      mergedAttributes[attribute as keyof typeof mergedAttributes],
    )

  if (useRemoteTabs) browser.setAttribute('maychangeremoteness', 'true')

  return browser
}

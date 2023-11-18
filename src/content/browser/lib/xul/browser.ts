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

export function createBrowser({ remoteType }: { remoteType?: string } = {}) {
  const browser = document.createXULElement('browser')
  if (remoteType) {
    browser.setAttribute('remoteType', remoteType)
    browser.setAttribute('remote', true)
  }

  for (const attribute in DEFAULT_BROWSER_ATTRIBUTES)
    browser.setAttribute(
      attribute,
      DEFAULT_BROWSER_ATTRIBUTES[
        attribute as keyof typeof DEFAULT_BROWSER_ATTRIBUTES
      ],
    )

  if (useRemoteTabs) browser.setAttribute('maychangeremoteness', 'true')

  return browser
}

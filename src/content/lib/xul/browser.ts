import { resource } from '../resources'

const { useRemoteTabs, useRemoteSubframe } = window.docShell.QueryInterface(
  Ci.nsILoadContext,
)

console.log(useRemoteTabs, useRemoteSubframe)

const DEFAULT_BROWSER_ATTRIBUTES = {
  message: 'true',
  messagemanagergroup: 'browsers',
  type: 'content',
} as const

export function setURI(browser: any, uri: nsIURIType) {
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

  for (const attribute in DEFAULT_BROWSER_ATTRIBUTES)
    browser.setAttribute(
      attribute,
      DEFAULT_BROWSER_ATTRIBUTES[
        attribute as keyof typeof DEFAULT_BROWSER_ATTRIBUTES
      ],
    )

  if (useRemoteTabs) browser.setAttribute('maychangeremoteness', 'true')
  if (remoteType) {
    browser.setAttribute('remoteType', remoteType)
    browser.setAttribute('remote', true)
  }

  return browser
}
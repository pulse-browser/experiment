// @ts-check
/// <reference types="@browser/link" />
/// <reference types="gecko-types" />
import { browserImports } from '../browserImports.js'

const DEFAULT_BROWSER_ATTRIBUTES = {
  message: 'true',
  messagemanagergroup: 'browsers',
  type: 'content',
  contextmenu: 'browser_context_menu',
}

const { useRemoteTabs, useRemoteSubframe } = window.docShell.QueryInterface(
  Ci.nsILoadContext,
)

let nextWindowBrowserId = 0

/**
 * @param {() => boolean} predicate
 * @param {number} [timing=10]
 */
async function spinlock(predicate, timing = 10) {
  while (!predicate()) {
    await new Promise((res) => setTimeout(res, timing))
  }
}

/**
 * @returns {WebsiteView}
 */
export function create(uri) {
  let originAttributes = browserImports.E10SUtils.predictOriginAttributes({
    window,
  })
  const remoteType = browserImports.E10SUtils.getRemoteTypeForURI(
    uri.spec,
    useRemoteTabs,
    useRemoteSubframe,
    browserImports.E10SUtils.DEFAULT_REMOTE_TYPE,
    uri,
    originAttributes,
  )

  const browser = document.createXULElement('browser')
  if (remoteType) {
    browser.setAttribute('remoteType', remoteType)
    browser.setAttribute('remote', true)
  }

  for (const attribute in DEFAULT_BROWSER_ATTRIBUTES) {
    browser.setAttribute(attribute, DEFAULT_BROWSER_ATTRIBUTES[attribute])
  }

  if (useRemoteTabs) {
    browser.setAttribute('maychangeremoteness', 'true')
  }

  return {
    windowBrowserId: nextWindowBrowserId++,
    browser,
  }
}

/**
 * @param {WebsiteView} view
 */
function initialized(view) {
  view.browser.docShell
  return spinlock(() => view.browser.mInitialized)
}

/**
 * @param {WebsiteView} view
 * @param {nsIURIType} uri
 */
export async function goTo(view, uri) {
  await initialized(view)

  console.debug('Going to', uri)
  view.browser.source = uri.spec
  try {
    view.browser.loadURI(uri, {
      triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal(),
    })
  } catch (e) {
    console.debug('Debug info for changing url')
    console.debug(view, uri)
    console.error(e)
  }
}

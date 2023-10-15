import { Deferred } from '../Deferred'
import { NSBrowserAccess } from './NSBrowserAccess'
import { globalXULBrowserWindow } from './XULBrowserWindow'

export const domContentLoaded: Deferred<null> = new Deferred()
window.addEventListener(
  'load',
  () => {
    // This code needs to be run before the first remote browser is created
    window.docShell.treeOwner
      .QueryInterface(Ci.nsIInterfaceRequestor)
      .getInterface(Ci.nsIAppWindow).XULBrowserWindow = globalXULBrowserWindow
    ;(window as any).browserDOMWindow = new NSBrowserAccess()

    domContentLoaded.resolve && domContentLoaded.resolve(null)
  },
  {
    once: true,
  },
)

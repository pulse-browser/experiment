import BrowserContextMenu from './BrowserContextMenu.svelte'
import HamburgerMenu from './HamburgerMenu/HamburgerMenu.svelte'

/**
 * @param target The target element to open at
 * @param anchor Information about the anchor point {@link https://udn.realityripple.com/docs/Archive/Mozilla/XUL/PopupGuide/Positioning}
 */
export const openHamburgerMenu = (target: HTMLElement, anchor: string) =>
  (document.getElementById('hamburgerMenu') as XULPanel | null)?.openPopup(
    target,
    anchor,
  )

export { BrowserContextMenu, HamburgerMenu }

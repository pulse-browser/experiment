export function getClipboardHelper(): nsIClipboardHelperType {
  return (Cc['@mozilla.org/widget/clipboardhelper;1'] as any).getService(
    Ci.nsIClipboardHelper,
  )
}

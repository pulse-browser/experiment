/// <reference path="../link.d.ts" />

export class LinkHandlerParent extends JSWindowActorParent {
  receiveMessage(aMsg) {
    console.log('LinkHandlerParent', aMsg, this)
    const win = this.browsingContext.topChromeWindow

    switch (aMsg.name) {
      case 'Link:SetIcon':
        return win.windowApi.setIcon(
          this.browsingContext.embedderElement,
          aMsg.data.iconURL,
        )
    }
  }
}

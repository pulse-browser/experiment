declare type ClickHandlerMessage = {
  name: 'openlink'
  data: { href: string }
} & { target: JSWindowActorParent }

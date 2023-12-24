/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="gecko-types" />

type nsIEventTarget = nsIEventTargetType
interface Principal {}

type nsISupports = nsISupportsType

interface FrameLoader {}

interface MessagePort {}

declare interface ReceiveMessageArgument {
  target: nsISupports
  name: string
  sync: boolean
  data?: any
  json?: any
  ports: MessagePort[]
  targetFrameLoader?: FrameLoader
}

declare interface MessageListener {
  receiveMessage(argument: ReceiveMessageArgument): any
}

declare interface MessageListenerManagerMixin {
  addMessageListener(
    messageName: string,
    listener: MessageListener,
    listenWhenClosed?: boolean,
  ): void
  removeMessageListener(messageName: string, listener: MessageListener): void
  addWeakMessageListener(messageName: string, listener: MessageListener): void
  removeWeakMessageListener(
    messageName: string,
    listener: MessageListener,
  ): void
}

declare interface MessageListenerManager extends MessageListenerManagerMixin {}

declare interface MessageSenderMixin {
  sendAsyncMessage(messageName?: string, obj?: any, transfers?: any): void
  readonly processMessageManager?: MessageSender
  readonly remoteType: string
}

declare interface MessageSender
  extends MessageListenerManager,
    MessageSenderMixin {}

declare interface SyncMessageSenderMixin {
  sendSyncMessage(messageName?: string, obj?: any): any[]
}

declare interface SyncMessageSender
  extends MessageSender,
    SyncMessageSenderMixin {}

declare interface ChildProcessMessageManager extends SyncMessageSender {}

declare interface MessageManagerGlobal {
  dump(str: string): void
  atob(asciiString: string): string
  btoa(base64Data: string): string
}

declare interface FrameScriptLoader {
  loadFrameScript(
    url: string,
    allowDelayedLoad: boolean,
    runInGlobalScope?: boolean,
  ): void
  removeDelayedFrameScript(url: string): void
  getDelayedFrameScripts(): any[][]
}

declare interface ProcessScriptLoader {
  loadProcessScript(url: string, allowDelayedLoad: boolean): void
  removeDelayedProcessScript(url: string): void
  getDelayedProcessScripts(): any[][]
}

declare interface GlobalProcessScriptLoader {
  readonly initialProcessData: any
  readonly sharedData: any
}

declare interface ContentFrameMessageManager
  extends EventTarget,
    MessageManagerGlobal,
    SyncMessageSenderMixin,
    MessageSenderMixin,
    MessageListenerManagerMixin {
  readonly content?: Window
  readonly docShell?: any
  readonly tabEventTarget?: nsIEventTarget
}

declare interface ContentProcessMessageManager
  extends MessageManagerGlobal,
    SyncMessageSenderMixin,
    MessageSenderMixin,
    MessageListenerManagerMixin {
  readonly initialProcessData: any
  readonly sharedData?: any
}

declare interface MessageBroadcaster extends MessageListenerManager {
  broadcastAsyncMessage(messageName?: string, obj?: any): void
  readonly childCount: number
  getChildAt(aIndex: number): MessageListenerManager | null
  releaseCachedProcesses(): void
}

declare interface ChromeMessageBroadcaster
  extends MessageBroadcaster,
    FrameScriptLoader {}

declare interface ParentProcessMessageManager
  extends MessageBroadcaster,
    ProcessScriptLoader,
    GlobalProcessScriptLoader {}

declare interface ChromeMessageSender
  extends MessageSender,
    FrameScriptLoader {}

declare interface ProcessMessageManager
  extends MessageSender,
    ProcessScriptLoader {
  readonly osPid: number
  readonly isInProcess: boolean
}

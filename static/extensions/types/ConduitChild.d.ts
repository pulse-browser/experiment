/* eslint-disable @typescript-eslint/ban-types */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * This @file implements the child side of Conduits, an abstraction over
 * Fission IPC for extension API subject.  See {@link ConduitsParent.jsm}
 * for more details about the overall design.
 */
import {
  ConduitAddress,
  ConduitID,
} from 'resource://gre/modules/ConduitsParent.sys.mjs'

type JSWindowActor = unknown

/**
 * Base class for both child (Point) and parent (Broadcast) side of conduits,
 * handles setting up send/receive method stubs.
 */
export class BaseConduit {
  /**
   * @param {object} subject
   * @param {ConduitAddress} address
   */
  constructor(subject: object, address: ConduitAddress)
  subject: object
  address: ConduitAddress
  id: any
  recv: Map<any, any>
  /**
   * Internal, partially @abstract, uses the actor to send the message/query.
   *
   * @param {string} method
   * @param {boolean} query Flag indicating a response is expected.
   * @param {JSWindowActor} actor
   * @param {MessageData} data
   * @returns {Promise?}
   */
  _send(
    method: string,
    query: boolean,
    actor: JSWindowActor,
    data: MessageData,
  ): Promise<any> | null
  /**
   * Internal, calls the specific recvX method based on the message.
   *
   * @param {string} name Message/method name.
   * @param {object} arg  Message data, the one and only method argument.
   * @param {object} meta Metadata about the method call.
   */
  _recv(name: string, arg: object, meta: object): Promise<any>
}
/**
 * Child side conduit, can only send/receive point-to-point messages via the
 * one specific ConduitsChild actor.
 */
export class PointConduit extends BaseConduit {
  constructor(subject: any, address: any, actor: any)
  actor: any
  /**
   * Internal, sends messages via the actor, used by sendX stubs.
   *
   * @param {string} method
   * @param {boolean} query
   * @param {object?} arg
   * @returns {Promise?}
   */
  _send(
    method: string,
    query: boolean,
    arg?: object | null,
  ): Promise<any> | null
  /**
   * Closes the conduit from further IPC, notifies the parent side by default.
   *
   * @param {boolean} silent
   */
  close(silent?: boolean): void
  closeCallback: Function
  /**
   * Set the callback to be called when the conduit is closed.
   *
   * @param {Function} callback
   */
  setCloseCallback(callback: Function): void
}
/**
 * Implements the child side of the Conduits actor, manages conduit lifetimes.
 */
export class ConduitsChild {
  conduits: Map<any, any>
  /**
   * Public entry point a child-side subject uses to open a conduit.
   *
   * @param {object} subject
   * @param {ConduitAddress} address
   * @returns {PointConduit}
   */
  openConduit(subject: object, address: ConduitAddress): PointConduit
  /**
   * JSWindowActor method, routes the message to the target subject.
   *
   * @param {object} options
   * @param {string} options.name
   * @param {MessageData | MessageData[]} options.data
   * @returns {Promise?}
   */
  receiveMessage({
    name,
    data,
  }: {
    name: string
    data: MessageData | MessageData[]
  }): Promise<any> | null
  /**
   * JSWindowActor method, ensure cleanup.
   */
  didDestroy(): void
}
/**
 * Child side of the Conduits process actor.  Same code as JSWindowActor.
 */
export class ProcessConduitsChild {
  conduits: Map<any, any>
  openConduit: (subject: object, address: ConduitAddress) => PointConduit
  receiveMessage: ({
    name,
    data,
  }: {
    name: string
    data: MessageData | MessageData[]
  }) => Promise<any>
  willDestroy: any
  didDestroy: () => void
}
/**
 * This
 */
export type MessageData = {
  target?: ConduitID
  sender?: ConduitID
  query: boolean
  arg: object
}

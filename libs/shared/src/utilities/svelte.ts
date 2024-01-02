/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import {
  type Invalidator,
  type Readable,
  type StartStopNotifier,
  type Subscriber,
  type Unsubscriber,
  type Updater,
  type Writable,
  get,
  readable,
} from 'svelte/store'

import { observable } from '../xul/index.js'

type SubInvTuple<T> = [Subscriber<T>, Invalidator<T>]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const subscriber_queue: (SubInvTuple<any> | any)[] = []
const noop = () => {}

export function safe_not_equal<T>(a: T, b: T): boolean {
  return a != a
    ? b == b
    : a !== b || (a && typeof a === 'object') || typeof a === 'function'
}

export interface ViewableWritable<T> extends Writable<T> {
  readOnce(): T
}

/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * This variant allows for reading outside of a subscription
 *
 * https://svelte.dev/docs/svelte-store#writable
 *
 * @license MIT The following code was taken directly from svelte. For the license
 *              see svelteUtils.svelte.license.md
 */
export function viewableWritable<T>(
  value: T,
  start: StartStopNotifier<T> = noop,
): ViewableWritable<T> {
  let stop: Unsubscriber | null = null
  const subscribers: Set<[Subscriber<T>, Invalidator<T>]> = new Set()

  function set(new_value: T): void {
    if (safe_not_equal(value, new_value)) {
      value = new_value
      if (stop) {
        // store is ready
        const run_queue = !subscriber_queue.length
        for (const subscriber of subscribers) {
          subscriber[1]()
          subscriber_queue.push(subscriber, value)
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1])
          }
          subscriber_queue.length = 0
        }
      }
    }
  }

  function update(fn: Updater<T>): void {
    set(fn(value))
  }

  function subscribe(
    run: Subscriber<T>,
    invalidate: Invalidator<T> = noop,
  ): Unsubscriber {
    const subscriber: SubInvTuple<T> = [run, invalidate]
    subscribers.add(subscriber)
    if (subscribers.size === 1) {
      stop = start(set, update) || noop
    }
    run(value)
    return () => {
      subscribers.delete(subscriber)
      if (subscribers.size === 0 && stop) {
        stop()
        stop = null
      }
    }
  }

  function readOnce(): T {
    return value
  }

  return { set, update, subscribe, readOnce }
}

export function resolverStore<T>(
  intermediate: T,
  toResolve: Promise<Readable<T>>,
): Readable<T> {
  return readable(intermediate, (set) => {
    toResolve.then((resolved) => {
      set(get(resolved))
      resolved.subscribe(set)
    })
  })
}

// NOTE: Autocurrying doesn't infer T correctly
export const dynamicStringPref =
  <T>(processor: (value: string) => T) =>
  (pref: string): Readable<T> =>
    readable(processor(Services.prefs.getStringPref(pref, '')), (set) => {
      const observer = observable(() =>
        set(processor(Services.prefs.getStringPref(pref, ''))),
      )
      Services.prefs.addObserver(pref, observer)
      return () => Services.prefs.removeObserver(pref, observer)
    })

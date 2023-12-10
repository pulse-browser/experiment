/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable no-console */
import kleur from 'kleur'
import { exit } from 'process'

const { bold } = kleur

const applyToEachLine = <T extends { toString(): string }>(
  prefix: string,
  messages: (string | T)[],
): string =>
  messages
    .map((msg) => (typeof msg == 'string' ? msg : msg.toString()))
    .join(' ')
    .split('\n')
    .map((msg) => `${prefix} ${msg}`)
    .join('\n')

export function failure<T extends { toString(): string }>(...msg: T[]): never {
  console.error(applyToEachLine(bold().red('FAILURE '), msg))
  exit(2)
}

export function info<T extends { toString(): string }>(...msg: T[]) {
  console.info(applyToEachLine(bold().blue('INFO '), msg))
}

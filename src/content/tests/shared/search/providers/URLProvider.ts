/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { test } from 'zora'

import { URLProvider } from '@shared/search/providers/URLProvider'

export default async function () {
  const urlProvider = new URLProvider()

  await test('URLProvider: google.com', async (t) => {
    const result = await urlProvider.getResults('google.com')
    t.ok(result, 'result exists')
    t.ok(result.length > 0, 'result has length')
    if (!result.length) return
    t.equal(result[0].title, 'https://google.com', 'title is correct')
    t.equal(result[0].url.spec, 'https://google.com/', 'url is correct')
  })

  await test('URLProvider: https://google.com', async (t) => {
    const result = await urlProvider.getResults('https://google.com')
    t.ok(result, 'result exists')
    t.ok(result.length > 0, 'result has length')
    if (!result.length) return
    t.equal(result[0].title, 'https://google.com', 'title is correct')
    t.equal(result[0].url.spec, 'https://google.com/', 'url is correct')
  })

  await test('URLProvider: google.com/test', async (t) => {
    const result = await urlProvider.getResults('google.com/test')
    t.ok(result, 'result exists')
    t.ok(result.length > 0, 'result has length')
    if (!result.length) return
    t.equal(result[0].title, 'https://google.com/test', 'title is correct')
    t.equal(result[0].url.spec, 'https://google.com/test', 'url is correct')
  })

  await test('URLProvider: https://google.com/test', async (t) => {
    const result = await urlProvider.getResults('https://google.com/test')
    t.ok(result, 'result exists')
    t.ok(result.length > 0, 'result has length')
    if (!result.length) return
    t.equal(result[0].title, 'https://google.com/test', 'title is correct')
    t.equal(result[0].url.spec, 'https://google.com/test', 'url is correct')
  })

  await test('URLProvider: https://abc.notarealurl', async (t) => {
    const result = await urlProvider.getResults('https://abc.notarealurl')
    t.ok(result, 'result exists')
    t.equal(result.length, 0, 'result has length')
  })

  await test('URLProvider: https://abc.notarealurl/test', async (t) => {
    const result = await urlProvider.getResults('https://abc.notarealurl/test')
    t.ok(result, 'result exists')
    t.equal(result.length, 0, 'result has length')
  })

  await test('URLProvider: text', async (t) => {
    const result = await urlProvider.getResults('text')
    t.ok(result, 'result exists')
    t.equal(result.length, 0, 'result has length')
  })
}

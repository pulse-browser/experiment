import { test } from 'zora'

import { search } from '@shared/ExtHistoryAPI'

export default async function () {
  await test('ExtHistoryApi: Search, default options', async (t) => {
    const result = await search({})
    t.ok(Array.isArray(result), 'Search should be an array')
  })
}

import { curry } from 'fnts'

export const isBitSet = curry((bit: number, num: number) => (num & bit) !== 0)
export const isBitSetFast = curry((bit: number, num: number) => num & bit)

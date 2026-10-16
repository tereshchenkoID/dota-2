import { BALANCE } from '@/modules/Dota/config/balance'
import { HEROES } from '@/modules/Dota/config/heroes'
import { ITEMS } from '@/modules/Dota/config/items'

import { secureRandom } from '@/lib/random'
export const SYMBOLS = [...HEROES, ...ITEMS]
export function weightedSymbol(random, pool = SYMBOLS) {
  const total = pool.reduce((a, s) => a + s.weight, 0)
  let roll = random() * total
  return (pool.find((s) => (roll -= s.weight) < 0) || pool.at(-1)).id
}
export function generateGrid(random = secureRandom) {
  // A weighted rally symbol makes meaningful formations possible with 13 symbols.
  // Each cell independently chooses rally or the full weighted pool. No guaranteed wins.
  const rally = weightedSymbol(random)
  return Array.from({ length: 5 }, () =>
    Array.from({ length: 3 }, () =>
      random() < BALANCE.rallyChance ? rally : weightedSymbol(random),
    ),
  )
}
export const INITIAL_GRID = Array.from({ length: 5 }, (_, c) =>
  Array.from({ length: 3 }, (_, r) => HEROES[(c + r * 2) % HEROES.length].id),
)

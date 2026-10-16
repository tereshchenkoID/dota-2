import { ARCADE_CONFIG } from './arcade-config'
import { RUNES } from './runes'
import { UPGRADES } from './upgrades'

import { seededRandom } from '@/lib/random'

export const REWARDS = [...UPGRADES, ...RUNES]

export function generateRewardChoices(run, random = seededRandom((run.seed + run.stage * 2654435761) >>> 0)) {
  const pool = REWARDS.filter((entry) => entry.minStage <= run.stage && (entry.type === 'rune' || (run.upgrades[entry.id] || 0) < entry.maxLevel))
  const choices = []
  while (choices.length < 3 && pool.length) {
    const total = pool.reduce((sum, entry) => sum + ARCADE_CONFIG.rarityWeights[entry.rarity], 0)
    let roll = random() * total
    let index = pool.findIndex((entry) => (roll -= ARCADE_CONFIG.rarityWeights[entry.rarity]) < 0)
    if (index < 0) index = pool.length - 1
    choices.push(pool.splice(index, 1)[0].id)
  }
  return choices
}

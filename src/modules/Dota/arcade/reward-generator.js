import { ARCADE_CONFIG } from './arcade-config'
import { RUNES } from './runes'
import { UPGRADES } from './upgrades'

import { seededRandom } from '@/lib/random'

export const REWARDS = [...UPGRADES, ...RUNES]
const UNIVERSAL = ['blade-mastery', 'vitality', 'fortified-armor', 'battle-recovery', 'extra-charges', 'artifact-mastery']

export function generateRewardChoices(run, random = seededRandom((run.seed + run.stage * 2654435761) >>> 0), { disabledIds = [] } = {}) {
  let pool = REWARDS.filter((entry) => !disabledIds.includes(entry.id) && entry.minStage <= run.stage && (entry.type === 'rune' || (run.upgrades[entry.id] || 0) < entry.maxLevel))
  const choices = []
  const affinity = Object.fromEntries(['offense', 'defense', 'utility'].map((type) => [type, UPGRADES.filter((entry) => entry.type === type).reduce((sum, entry) => sum + (run.upgrades[entry.id] || 0), 0)]))
  while (choices.length < 3 && pool.length) {
    let candidates = pool
    if (!choices.length && random() < 0.7) candidates = pool.filter((entry) => UNIVERSAL.includes(entry.id))
    const types = choices.map((entry) => entry.type)
    if (choices.length === 2 && types[0] === types[1] && pool.some((entry) => entry.type !== types[0])) candidates = pool.filter((entry) => entry.type !== types[0])
    else if (choices.length === 2 && random() < 0.75 && pool.some((entry) => !types.includes(entry.type))) candidates = candidates.filter((entry) => !types.includes(entry.type))
    if (!candidates.length) candidates = pool
    const weight = (entry) => ARCADE_CONFIG.rarityWeights[entry.rarity] * (choices.length === 1 ? Math.min(2.2, 1 + (affinity[entry.type] || 0) * 0.18 + (run.upgrades[entry.id] ? 0.4 : 0)) : 1)
    let roll = random() * candidates.reduce((sum, entry) => sum + weight(entry), 0)
    const reward = candidates.find((entry) => (roll -= weight(entry)) < 0) || candidates.at(-1)
    choices.push(reward)
    pool = pool.filter((entry) => entry.id !== reward.id)
  }
  return choices.map((entry) => entry.id)
}

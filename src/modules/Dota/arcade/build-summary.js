import { RUNES } from './runes'
import { getBonuses } from './upgrades'

export function getBuildSummary(run) {
  const bonuses = getBonuses(run.upgrades)
  const rune = RUNES.find((entry) => entry.id === (run.activeRune?.id || run.preparedRune)) || null
  return {
    bonuses, rune,
    groups: [
      { id: 'offense', rows: [['heroBonus', bonuses.heroBonus, 'percent'], ['criticalBonus', bonuses.criticalBonus, 'percent'], ['abilityBonus', bonuses.abilityBonus, 'percent'], ['eliteBonus', bonuses.eliteBonus, 'percent']] },
      { id: 'defense', rows: [['hp', run.battle.hp], ['maxHp', run.maxHp], ['shields', run.battle.shields], ['startingShields', bonuses.shields], ['recovery', bonuses.recovery], ['reviveHp', bonuses.reviveHp]] },
      { id: 'utility', rows: [['spins', run.battle.spins], ['extraSpins', bonuses.spins], ['artifactBonus', bonuses.artifactBonus, 'percent'], ['runeMultiplier', run.activeRune ? rune?.effects.damageMultiplier || 1 : 1, 'factor']] },
    ],
  }
}

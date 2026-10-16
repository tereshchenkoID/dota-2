import { ARCADE_CONFIG } from './arcade-config'
import { MODIFIERS } from './modifiers'

export function getStageConfig(stage, modifierId = null) {
  const level = Math.max(1, Math.floor(Number(stage) || 1))
  const step = level - 1
  const elite = level % ARCADE_CONFIG.eliteInterval === 0
  const modifier = MODIFIERS.find((entry) => entry.id === modifierId)
  const effects = modifier?.effects || {}
  const maxHp = Math.round(ARCADE_CONFIG.baseHp + ARCADE_CONFIG.hpPerStage * step + ARCADE_CONFIG.hpAcceleration * step ** 2 + (elite ? ARCADE_CONFIG.baseHp * ARCADE_CONFIG.eliteHpBonus * (1 + step * ARCADE_CONFIG.eliteHpGrowth) : 0))
  const damage = Math.round((ARCADE_CONFIG.baseDamage + ARCADE_CONFIG.damagePerStage * step) * (elite ? 1 + ARCADE_CONFIG.eliteDamageBonus : 1) * (effects.attackMultiplier || 1))
  return {
    stage: level,
    elite,
    maxHp,
    damage,
    spins: ARCADE_CONFIG.spins + (effects.spins || 0),
    attackInterval: Math.max(1, ARCADE_CONFIG.attackInterval + (effects.attackInterval || 0)),
    receivedDamage: effects.receivedDamage || 1,
    phases: [
      { threshold: 0.66, damage },
      { threshold: 0.3, damage: Math.round(damage * 1.4) },
      { threshold: 0, damage: Math.round(damage * 1.8) },
    ],
    modifier: modifier?.id || null,
  }
}

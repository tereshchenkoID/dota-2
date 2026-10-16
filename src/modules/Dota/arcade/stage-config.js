import { ARCADE_CONFIG } from './arcade-config'
import { MODIFIERS } from './modifiers'

export function getStageConfig(stage, modifierId = null) {
  const level = Math.max(1, Math.floor(Number(stage) || 1))
  const step = level - 1
  const endlessSteps = Math.max(0, level - ARCADE_CONFIG.endlessStage)
  const elite = level % ARCADE_CONFIG.eliteInterval === 0
  const modifier = MODIFIERS.find((entry) => entry.id === modifierId)
  const effects = modifier?.effects || {}
  const growth = Math.min(step, 2) * ARCADE_CONFIG.hpGrowth[0] + Math.min(Math.max(step - 2, 0), 3) * ARCADE_CONFIG.hpGrowth[1] + Math.min(Math.max(step - 5, 0), 4) * ARCADE_CONFIG.hpGrowth[2] + Math.max(step - 9, 0) * ARCADE_CONFIG.hpGrowth[3]
  const eliteStep = ARCADE_CONFIG.baseHp * ARCADE_CONFIG.eliteHpBonus
  const maxHp = Math.round(ARCADE_CONFIG.baseHp + growth + endlessSteps * (ARCADE_CONFIG.endlessHpGrowth - ARCADE_CONFIG.hpGrowth[3]) + Math.floor(level / ARCADE_CONFIG.eliteInterval) * eliteStep + (elite ? Math.min(ARCADE_CONFIG.hpGrowth[0] * 0.8, eliteStep * 0.25) : 0))
  const attackGrowth = Math.min(step, 2) * ARCADE_CONFIG.damageGrowth[0] + Math.min(Math.max(step - 2, 0), 3) * ARCADE_CONFIG.damageGrowth[1] + Math.min(Math.max(step - 5, 0), 4) * ARCADE_CONFIG.damageGrowth[2] + Math.max(step - 9, 0) * ARCADE_CONFIG.damageGrowth[3]
  const damage = Math.round((ARCADE_CONFIG.baseDamage + attackGrowth + endlessSteps * (ARCADE_CONFIG.endlessDamageGrowth - ARCADE_CONFIG.damageGrowth[3])) * (elite ? 1 + ARCADE_CONFIG.eliteDamageBonus : 1) * (effects.attackMultiplier || 1))
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

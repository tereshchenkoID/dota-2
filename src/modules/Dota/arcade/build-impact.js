import { ARCADE_CONFIG } from './arcade-config'
import { resolveArcadeEffect } from './effect-resolver'
import { getBonuses, UPGRADES } from './upgrades'

export const EMPTY_DAMAGE_SOURCES = { base: 0, upgrades: 0, rune: 0 }

export function getCappedDamageBreakdown(effect, dealt) {
  if (!effect.damage) return { ...EMPTY_DAMAGE_SOURCES }
  const base = Math.round(dealt * effect.breakdown.base / effect.damage)
  const upgrades = Math.min(dealt - base, Math.round(dealt * effect.breakdown.upgrades / effect.damage))
  return { base, upgrades, rune: dealt - base - upgrades }
}

export function getBuildProgress(run) {
  const levels = UPGRADES.map((entry) => Math.min(entry.maxLevel, Math.max(0, run.upgrades?.[entry.id] || 0)))
  return {
    total: levels.reduce((sum, level) => sum + level, 0),
    capacity: UPGRADES.reduce((sum, entry) => sum + entry.maxLevel, 0),
    highest: Math.max(0, ...levels),
    maximum: Math.max(...UPGRADES.map((entry) => entry.maxLevel)),
    startingHp: ARCADE_CONFIG.playerHp,
    baseSpins: run.stageConfig.spins,
    startingSpins: run.stageConfig.spins + getBonuses(run.upgrades).spins,
  }
}

// Controlled examples use this Roshan's modifier/elite state, the real resolver,
// no items and no HP cap. They illustrate a combo, not the next random spin.
export function getHeroPreview(run, id, count = 3) {
  const matches = [{ id, count }]
  const base = resolveArcadeEffect(matches, { ...run, upgrades: {}, activeRune: null }).damage
  const build = resolveArcadeEffect(matches, { ...run, activeRune: null }).damage
  const total = resolveArcadeEffect(matches, run).damage
  return { id, base, build, total, bonus: build - base, rune: total - build }
}

export function getDamageSources(run) {
  const sources = { ...EMPTY_DAMAGE_SOURCES, ...run.damageSources }
  return { ...sources, tracked: sources.base + sources.upgrades + sources.rune }
}

export function getItemPreview(run, id, field, count = 3) {
  const matches = [{ id, count }]
  const base = resolveArcadeEffect(matches, { ...run, upgrades: {}, activeRune: null })[field]
  const value = resolveArcadeEffect(matches, { ...run, activeRune: null })[field]
  return { base, value }
}

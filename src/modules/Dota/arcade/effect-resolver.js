import { BALANCE } from '@/modules/Dota/config/balance'
import { HEROES } from '@/modules/Dota/config/heroes'
import { ITEM_EFFECTS } from '@/modules/Dota/engine/damage'

import { ARCADE_CONFIG } from './arcade-config'
import { RUNES } from './runes'
import { getBonuses } from './upgrades'

const EMPTY = { damage: 0, heroDamage: 0, baseHeroDamage: 0, abilityDamage: 0, criticalDamage: 0, extraSpins: 0, shields: 0, healing: 0 }
const ITEM_ORDER = Object.keys(ITEM_EFFECTS)

// Refresher remembers only the raw, non-refreshed effect. Rune and upgrade
// multipliers never enter this snapshot, so repeated Orbs cannot compound it.
export function resolveArcadeEffect(matches, run) {
  const bonuses = getBonuses(run.upgrades)
  const rune = RUNES.find((entry) => entry.id === run.activeRune?.id)?.effects || {}
  let raw = { ...EMPTY }
  const abilities = []
  for (const match of matches) {
    const hero = HEROES.find((entry) => entry.id === match.id)
    if (!hero) continue
    const damage = hero.baseDamage * BALANCE.matchMultipliers[match.count]
    raw.damage += damage
    raw.heroDamage += damage
    raw.baseHeroDamage += damage
    if (match.count >= 4) raw.abilityDamage += damage
    if (hero.id === 'phantom-assassin') raw.criticalDamage += damage
    abilities.push(match.count === 5 ? hero.ultimate : hero.ability)
  }
  const items = matches.filter((match) => ITEM_EFFECTS[match.id]).sort((a, b) => {
    const order = (id) => id === 'divine-rapier' ? -1 : ITEM_ORDER.indexOf(id)
    return order(a.id) - order(b.id)
  })
  for (const item of items.filter((entry) => entry.id !== 'refresher-orb')) {
    const before = raw.damage
    const criticalBefore = raw.criticalDamage
    raw = ITEM_EFFECTS[item.id](raw, item.count - 2)
    if (['daedalus', 'aghanims-scepter'].includes(item.id)) {
      const multiplier = before ? raw.damage / before : 1
      raw.heroDamage *= multiplier
      raw.abilityDamage *= multiplier
      raw.criticalDamage *= multiplier
      if (item.id === 'daedalus') raw.criticalDamage += Math.max(0, before - criticalBefore) * (multiplier - 1)
    }
    abilities.push(item.id)
  }
  const directHero = raw.heroDamage + Math.max(0, raw.heroDamage - raw.baseHeroDamage) * bonuses.artifactBonus
  const snapshot = { ...raw }
  for (const item of items.filter((entry) => entry.id === 'refresher-orb')) {
    const copies = item.count - 2
    const previous = run.battle.lastEffect || EMPTY
    raw = ITEM_EFFECTS[item.id](raw, copies, previous)
    raw.heroDamage += (previous.heroDamage || 0) * copies
    raw.baseHeroDamage += (previous.baseHeroDamage ?? previous.heroDamage ?? 0) * copies
    raw.abilityDamage += (previous.abilityDamage || 0) * copies
    raw.criticalDamage += (previous.criticalDamage || 0) * copies
    abilities.push(item.id)
  }
  const heroMultiplier = 1 + bonuses.heroBonus
  const artifactHero = raw.heroDamage + Math.max(0, raw.heroDamage - raw.baseHeroDamage) * bonuses.artifactBonus
  const advancedShare = raw.heroDamage ? raw.abilityDamage / raw.heroDamage : 0
  const heroDamage = artifactHero * (heroMultiplier + advancedShare * bonuses.abilityBonus)
  const artifactDamage = Math.max(0, raw.damage - raw.heroDamage) * (1 + bonuses.artifactBonus)
  const upgradeDamage = heroDamage + artifactDamage + Math.min(raw.damage, raw.criticalDamage) * bonuses.criticalBonus
  let damage = upgradeDamage
  damage += heroDamage * (rune.abilityBonus || 0)
  damage += directHero * heroMultiplier * (rune.heroEcho || 0)
  const eliteMultiplier = run.stageConfig.elite ? 1 + bonuses.eliteBonus : 1
  const resistance = run.stageConfig.receivedDamage
  const base = Math.round(raw.damage * resistance)
  const upgraded = Math.round(upgradeDamage * eliteMultiplier * resistance)
  damage = Math.max(0, Math.round(damage * eliteMultiplier * (rune.damageMultiplier || 1) * resistance))
  return {
    damage,
    breakdown: { base, upgrades: Math.max(0, upgraded - base), rune: Math.max(0, damage - upgraded) },
    healing: Math.max(0, Math.round(raw.healing * (1 + bonuses.artifactBonus))),
    extraSpins: Math.min(ARCADE_CONFIG.maxExtraSpins, Math.max(0, Math.ceil(raw.extraSpins * (1 + bonuses.artifactBonus)))),
    shields: Math.min(ARCADE_CONFIG.maxShields, Math.max(0, Math.ceil(raw.shields * (1 + bonuses.artifactBonus)))),
    abilities,
    snapshot: abilities.some((id) => id !== 'refresher-orb') ? snapshot : run.battle.lastEffect,
  }
}

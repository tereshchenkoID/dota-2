import { BALANCE } from '@/modules/Dota/config/balance'
import { BOSS_CONFIG, getPhase } from '@/modules/Dota/config/boss'
import { findCombinations } from '@/modules/Dota/engine/combinations'
import { calculateDamage } from '@/modules/Dota/engine/damage'
import { INITIAL_GRID } from '@/modules/Dota/engine/spin'
export function createRun() {
  return {
    status: 'active',
    hp: BALANCE.playerHp,
    bossHp: BOSS_CONFIG.maxHp,
    spins: BALANCE.spins,
    turn: 0,
    shields: 0,
    totalDamage: 0,
    lastDamage: 0,
    lastHealing: 0,
    lastAbility: null,
    lastEffect: null,
    grid: INITIAL_GRID,
    matches: [],
    log: [],
    rewarded: false,
    lastAttack: 0,
  }
}
export function resolveTurn(run, grid) {
  if (run.status !== 'active' || run.spins <= 0) return run
  const matches = findCombinations(grid)
  const effect = calculateDamage(matches, run.lastEffect || 0)
  const dealt = Math.min(run.bossHp, effect.damage)
  const healing = Math.min(BALANCE.playerHp - run.hp, effect.healing || 0)
  const next = {
    ...run,
    hp: Math.min(BALANCE.playerHp, run.hp + healing),
    lastHealing: healing,
    grid,
    matches,
    turn: run.turn + 1,
    spins: run.spins - 1 + effect.extraSpins,
    bossHp: Math.max(0, run.bossHp - dealt),
    totalDamage: run.totalDamage + dealt,
    lastDamage: dealt,
    lastAbility: effect.abilities.at(-1) || run.lastAbility,
    lastEffect: effect.abilities.length ? effect : run.lastEffect,
    shields: run.shields + effect.shields,
    lastAttack: 0,
  }
  if (next.bossHp === 0) next.status = 'won'
  else {
    if (next.turn % BOSS_CONFIG.attackInterval === 0) {
      if (next.shields > 0) {
        next.shields--
        next.lastAttack = -1
      } else {
        next.lastAttack = BOSS_CONFIG.phases[getPhase(next.bossHp)].damage
        next.hp = Math.max(0, next.hp - next.lastAttack)
      }
    }
    if (next.hp === 0 || next.spins === 0) next.status = 'lost'
  }
  next.log = [
    {
      turn: next.turn,
      damage: dealt,
      healing,
      attack: next.lastAttack,
      ability: effect.abilities.at(-1) || null,
    },
    ...run.log,
  ].slice(0, 6)
  return next
}

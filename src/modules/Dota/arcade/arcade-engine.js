import { createRun } from '@/modules/Dota/engine/battle'
import { findCombinations } from '@/modules/Dota/engine/combinations'

import { ARCADE_CONFIG } from './arcade-config'
import { resolveArcadeEffect } from './effect-resolver'
import { chooseModifier } from './modifiers'
import { generateRewardChoices, REWARDS } from './reward-generator'
import { activateRune, consumeRune, RUNES } from './runes'
import { getStageConfig } from './stage-config'
import { getBonuses, UPGRADES } from './upgrades'

export const IDLE_RUN = { status: 'idle' }
export const INITIAL_ARCADE_STATS = { bestStage: 0, runs: 0, finished: 0, bosses: 0, damage: 0, spins: 0 }

export function enterStage(run, random) {
  const bonuses = getBonuses(run.upgrades)
  const stageConfig = getStageConfig(run.stage, chooseModifier(run.stage, random))
  const battle = {
    ...createRun(),
    hp: run.battle.hp,
    bossHp: stageConfig.maxHp,
    spins: stageConfig.spins + bonuses.spins,
    shields: bonuses.shields,
    secondWindUsed: false,
  }
  return {
    ...run,
    ...activateRune(battle, run.preparedRune, run.maxHp),
    status: 'fighting',
    stageConfig,
    maxStage: Math.max(run.maxStage, run.stage),
    choices: [],
    selectedReward: null,
  }
}

export function createArcadeRun({ id, seed, now = new Date().toISOString(), record = 0 }, random) {
  return enterStage({
    id,
    seed: seed >>> 0,
    status: 'idle',
    stage: 1,
    maxStage: 1,
    maxHp: ARCADE_CONFIG.playerHp,
    battle: { hp: ARCADE_CONFIG.playerHp },
    upgrades: {},
    preparedRune: null,
    activeRune: null,
    stageConfig: null,
    totalDamage: 0,
    totalSpins: 0,
    defeatedBosses: 0,
    startedAt: now,
    endedAt: null,
    recordAtStart: record,
    choices: [],
    selectedReward: null,
    defeatReason: null,
  }, random)
}

export function completeArcadeStage(run) {
  if (run.status !== 'fighting' || run.battle.status !== 'won') return run
  const recovery = getBonuses(run.upgrades).recovery
  const next = {
    ...run,
    status: 'choosing-reward',
    defeatedBosses: run.defeatedBosses + 1,
    activeRune: null,
    battle: { ...run.battle, hp: Math.min(run.maxHp, run.battle.hp + recovery) },
  }
  return { ...next, choices: generateRewardChoices(next) }
}

export function applyUpgrade(run, rewardId) {
  if (run.status !== 'choosing-reward' || !run.choices.includes(rewardId)) return run
  const reward = REWARDS.find((entry) => entry.id === rewardId)
  if (!reward) return run
  let next = { ...run, status: 'transitioning', choices: [], selectedReward: rewardId }
  if (reward.type === 'rune') return { ...next, preparedRune: rewardId }
  const level = run.upgrades[rewardId] || 0
  if (level >= reward.maxLevel) return run
  next = { ...next, upgrades: { ...run.upgrades, [rewardId]: level + 1 } }
  if (reward.effect === 'maxHp') {
    next.maxHp += reward.value
    next.battle = { ...run.battle, hp: Math.min(next.maxHp, run.battle.hp + reward.value) }
  }
  return next
}

export function startNextArcadeStage(run, random) {
  if (run.status !== 'transitioning' || !run.selectedReward) return run
  return enterStage({ ...run, stage: run.stage + 1 }, random)
}

export function finishArcadeRun(run, reason, now) {
  if (run.status !== 'fighting') return run
  return {
    ...run,
    status: 'defeated',
    activeRune: null,
    preparedRune: null,
    defeatReason: reason,
    endedAt: now,
    battle: { ...run.battle, status: 'lost' },
  }
}

export function resolveArcadeTurn(run, grid, now = new Date().toISOString()) {
  if (run.status !== 'fighting' || run.battle.spins <= 0) return run
  const battle = run.battle
  const matches = findCombinations(grid)
  const effect = resolveArcadeEffect(matches, run)
  const dealt = Math.min(battle.bossHp, effect.damage)
  const healing = Math.min(run.maxHp - battle.hp, effect.healing)
  const nextBattle = {
    ...battle,
    hp: Math.min(run.maxHp, battle.hp + healing),
    lastHealing: healing,
    grid,
    matches,
    turn: battle.turn + 1,
    spins: Math.max(0, battle.spins - 1 + effect.extraSpins),
    bossHp: Math.max(0, battle.bossHp - dealt),
    totalDamage: battle.totalDamage + dealt,
    lastDamage: dealt,
    lastAbility: effect.abilities.at(-1) || battle.lastAbility,
    lastEffect: effect.snapshot,
    shields: Math.min(ARCADE_CONFIG.maxShields, battle.shields + effect.shields),
    lastAttack: 0,
  }
  let next = {
    ...run,
    battle: nextBattle,
    totalDamage: run.totalDamage + dealt,
    totalSpins: run.totalSpins + 1,
  }
  // A killing blow wins before Roshan can retaliate, as in Classic.
  if (!nextBattle.bossHp) {
    nextBattle.status = 'won'
  } else if (nextBattle.turn % run.stageConfig.attackInterval === 0) {
    const runeBlocks = run.activeRune && run.activeRune.remaining > 0
      ? (runeBlocksAttack(run.activeRune.id)) : false
    if (runeBlocks) {
      nextBattle.lastAttack = -1
      next.activeRune = consumeRune(next.activeRune, 'attacks')
    } else if (nextBattle.shields > 0) {
      nextBattle.shields -= 1
      nextBattle.lastAttack = -1
    } else {
      const phase = nextBattle.bossHp / run.stageConfig.maxHp
      const attack = run.stageConfig.phases.find((entry) => phase > entry.threshold) || run.stageConfig.phases.at(-1)
      nextBattle.lastAttack = attack.damage
      nextBattle.hp = Math.max(0, nextBattle.hp - attack.damage)
      const reviveHp = getBonuses(run.upgrades).reviveHp
      if (!nextBattle.hp && reviveHp && !nextBattle.secondWindUsed) {
        nextBattle.hp = Math.min(run.maxHp, reviveHp)
        nextBattle.secondWindUsed = true
      }
    }
  }
  next.activeRune = consumeRune(next.activeRune, 'spins')
  nextBattle.log = [{ turn: nextBattle.turn, damage: dealt, healing, attack: nextBattle.lastAttack, ability: effect.abilities.at(-1) || null }, ...battle.log].slice(0, 6)
  if (nextBattle.status === 'won') return completeArcadeStage(next)
  if (!nextBattle.hp) return finishArcadeRun(next, 'hp', now)
  if (!nextBattle.spins || nextBattle.turn >= ARCADE_CONFIG.maxTurns) return finishArcadeRun(next, 'spins', now)
  return next
}

// One uniform rune config drives activation, consumption and attack blocking.
function runeBlocksAttack(id) {
  return Boolean(RUNES.find((rune) => rune.id === id)?.effects.blocks)
}

// Unknown arcade save versions start fresh while retaining records.
// Classic uses a different key and is never touched.
export function migrateArcadeState(persisted, version) {
  const stats = { ...INITIAL_ARCADE_STATS, ...persisted?.stats }
  if (version !== 1) return { run: IDLE_RUN, stats, pending: null }
  const run = persisted?.run
  if (!run || !['idle', 'fighting', 'choosing-reward', 'transitioning', 'defeated'].includes(run.status)) return { run: IDLE_RUN, stats, pending: null }
  if (run.status !== 'idle' && (!run.battle || !run.id || !run.stageConfig || !Number.isFinite(run.battle.hp))) return { run: IDLE_RUN, stats, pending: null }
  if (run.status !== 'idle') {
    const upgrades = Object.fromEntries(UPGRADES.map((entry) => [entry.id, Math.min(entry.maxLevel, Math.max(0, Math.floor(run.upgrades?.[entry.id] || 0)))]))
    return { run: { ...run, upgrades }, stats, pending: run.status === 'fighting' ? persisted.pending || null : null }
  }
  return { run, stats, pending: null }
}

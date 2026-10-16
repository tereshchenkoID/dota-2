import { createRun } from '@/modules/Dota/engine/battle'
import { findCombinations } from '@/modules/Dota/engine/combinations'

import { ARCADE_CONFIG } from './arcade-config'
import { EMPTY_DAMAGE_SOURCES, getCappedDamageBreakdown } from './build-impact'
import { resolveArcadeEffect } from './effect-resolver'
import { chooseModifier } from './modifiers'
import { generateRewardChoices, REWARDS } from './reward-generator'
import { RECORD_DEFAULTS } from './run-records'
import { activateRune, consumeRune, RUNES } from './runes'
import { normalizeArcadeState } from './save-normalizer'
import { getStageConfig } from './stage-config'
import { getBonuses } from './upgrades'

export const IDLE_RUN = { status: 'idle' }
export const INITIAL_ARCADE_STATS = { bestStage: 0, runs: 0, finished: 0, bosses: 0, damage: 0, spins: 0, ...RECORD_DEFAULTS }

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
    blockedAttacks: 0,
    bonusSpinsEarned: 0,
    healingReceived: 0,
    secondWindTriggered: false,
    lastBlockSource: null,
    lastBreakdown: null,
  }
  return {
    ...run,
    ...activateRune(battle, run.preparedRune, run.maxHp),
    status: 'fighting',
    stageConfig,
    maxStage: Math.max(run.maxStage, run.stage),
    choices: [],
    selectedReward: null,
    runeHistory: run.preparedRune ? { ...run.runeHistory, [run.preparedRune]: (run.runeHistory?.[run.preparedRune] || 0) + 1 } : run.runeHistory || {},
    runeActivation: run.preparedRune || null,
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
    runeHistory: {},
    recorded: false,
    preparedRune: null,
    activeRune: null,
    stageConfig: null,
    totalDamage: 0,
    damageSources: { ...EMPTY_DAMAGE_SOURCES },
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

export function completeArcadeStage(run, rewardOptions) {
  if (run.status !== 'fighting' || run.battle.status !== 'won') return run
  const recovery = getBonuses(run.upgrades).recovery
  const next = {
    ...run,
    status: 'choosing-reward',
    defeatedBosses: run.defeatedBosses + 1,
    activeRune: null,
    victorySummary: { bonusSpins: run.battle.bonusSpinsEarned || 0, healing: run.battle.healingReceived || 0, blocked: run.battle.blockedAttacks || 0, recovery: Math.min(recovery, run.maxHp - run.battle.hp) },
    battle: { ...run.battle, hp: Math.min(run.maxHp, run.battle.hp + recovery) },
  }
  return { ...next, choices: generateRewardChoices(next, undefined, rewardOptions) }
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

export function resolveArcadeTurn(run, grid, now = new Date().toISOString(), rewardOptions) {
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
    healingReceived: (battle.healingReceived || 0) + healing,
    bonusSpinsEarned: (battle.bonusSpinsEarned || 0) + effect.extraSpins,
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
    lastBlockSource: null,
    secondWindTriggered: false,
    lastBreakdown: getCappedDamageBreakdown(effect, dealt),
  }
  let next = {
    ...run,
    battle: nextBattle,
    totalDamage: run.totalDamage + dealt,
    totalSpins: run.totalSpins + 1,
    damageSources: Object.fromEntries(Object.keys(EMPTY_DAMAGE_SOURCES).map((key) => [key, (run.damageSources?.[key] || 0) + nextBattle.lastBreakdown[key]])),
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
      nextBattle.blockedAttacks = (battle.blockedAttacks || 0) + 1
      nextBattle.lastBlockSource = 'rune'
    } else if (nextBattle.shields > 0) {
      nextBattle.shields -= 1
      nextBattle.blockedAttacks = (battle.blockedAttacks || 0) + 1
      nextBattle.lastBlockSource = 'shield'
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
        nextBattle.secondWindTriggered = true
      }
    }
  }
  next.activeRune = consumeRune(next.activeRune, 'spins')
  nextBattle.log = [{ turn: nextBattle.turn, damage: dealt, healing, attack: nextBattle.lastAttack, ability: effect.abilities.at(-1) || null }, ...battle.log].slice(0, 6)
  if (nextBattle.status === 'won') return completeArcadeStage(next, rewardOptions)
  if (!nextBattle.hp) return finishArcadeRun(next, 'hp', now)
  if (!nextBattle.spins || nextBattle.turn >= ARCADE_CONFIG.maxTurns) return finishArcadeRun(next, 'spins', now)
  return next
}

// One uniform rune config drives activation, consumption and attack blocking.
function runeBlocksAttack(id) {
  return Boolean(RUNES.find((rune) => rune.id === id)?.effects.blocks)
}

// Migrations normalize the same schema on regular hydration as well as upgrades.
export function migrateArcadeState(persisted, version) {
  return normalizeArcadeState(persisted, version)
}

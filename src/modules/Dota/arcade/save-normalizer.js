import { createRun } from '@/modules/Dota/engine/battle'
import { SYMBOLS } from '@/modules/Dota/engine/spin'

import { ARCADE_CONFIG } from './arcade-config'
import { generateRewardChoices, REWARDS } from './reward-generator'
import { RECORD_DEFAULTS } from './run-records'
import { RUNES } from './runes'
import { getStageConfig } from './stage-config'
import { getBonuses, UPGRADES } from './upgrades'

const STAT_DEFAULTS = { bestStage: 0, runs: 0, finished: 0, bosses: 0, damage: 0, spins: 0, ...RECORD_DEFAULTS }
const STAT_KEYS = Object.keys(STAT_DEFAULTS).filter((key) => key !== 'recent')
const SYMBOL_IDS = new Set(SYMBOLS.map((entry) => entry.id))
const ABILITY_IDS = new Set(SYMBOLS.flatMap((entry) => [entry.ability, entry.ultimate, entry.type === 'item' ? entry.id : null]).filter(Boolean))
const RUNE_IDS = new Set(RUNES.map((entry) => entry.id))
const PHASES = ['idle', 'fighting', 'choosing-reward', 'transitioning', 'defeated']
const ISO = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value))
const numeric = (value, fallback = 0, maximum = Number.MAX_SAFE_INTEGER) => Number.isFinite(value) ? Math.min(maximum, Math.max(0, value)) : fallback
const object = (value) => value && typeof value === 'object' && !Array.isArray(value) ? value : {}
const levels = (value) => Object.fromEntries(UPGRADES.map((entry) => [entry.id, Math.floor(numeric(value?.[entry.id], 0, entry.maxLevel))]))
const runeCounts = (value) => Object.fromEntries(RUNES.filter((entry) => numeric(value?.[entry.id]) > 0).map((entry) => [entry.id, Math.floor(numeric(value[entry.id]))]))

export function isValidGrid(grid) {
  return Array.isArray(grid) && grid.length === 5 && grid.every((column) => Array.isArray(column) && column.length === 3 && column.every((id) => SYMBOL_IDS.has(id)))
}

export function normalizeArcadeState(persisted, version = 2) {
  const saved = object(persisted)
  const stats = Object.fromEntries(STAT_KEYS.map((key) => [key, numeric(saved.stats?.[key])]))
  const seen = new Set()
  stats.recent = (Array.isArray(saved.stats?.recent) ? saved.stats.recent : []).filter((entry) => {
    if (!entry?.id || seen.has(entry.id) || !Number.isFinite(entry.stage)) return false
    seen.add(entry.id)
    return true
  }).slice(0, 10).map((entry) => ({
    id: String(entry.id), stage: Math.floor(numeric(entry.stage)), bosses: numeric(entry.bosses),
    damage: numeric(entry.damage), spins: numeric(entry.spins), seconds: numeric(entry.seconds),
    endedAt: ISO(entry.endedAt) ? entry.endedAt : null,
    reason: entry.reason === 'hp' ? 'hp' : 'spins', upgrades: levels(entry.upgrades), runes: runeCounts(entry.runes),
  }))
  const empty = { run: { status: 'idle' }, stats, pending: null }
  const source = object(saved.run)
  if (!PHASES.includes(source.status) || source.status === 'idle' || typeof source.id !== 'string' || !source.id || !Number.isFinite(source.stage) || source.stage < 1 || !source.battle) return empty
  const upgrades = levels(source.upgrades)
  const maxHp = ARCADE_CONFIG.playerHp + getBonuses(upgrades).maxHp
  const hpIncrease = version < 2 && Number.isFinite(source.maxHp) ? Math.max(0, maxHp - source.maxHp) : 0
  const stage = Math.floor(source.stage)
  const fallbackStage = getStageConfig(stage)
  const previousStage = object(source.stageConfig)
  const stageConfig = {
    ...fallbackStage,
    ...previousStage,
    maxHp: numeric(previousStage.maxHp, fallbackStage.maxHp) || fallbackStage.maxHp,
    attackInterval: Math.max(1, Math.floor(numeric(previousStage.attackInterval, fallbackStage.attackInterval, 3))),
    receivedDamage: numeric(previousStage.receivedDamage, 1, 1) || 1,
    spins: Math.floor(numeric(previousStage.spins, fallbackStage.spins, 100)),
    phases: fallbackStage.phases.map((entry, index) => ({ ...entry, damage: numeric(previousStage.phases?.[index]?.damage, entry.damage) })),
  }
  const oldBattle = object(source.battle)
  const battle = { ...createRun(), ...oldBattle }
  for (const key of ['hp', 'bossHp', 'spins', 'turn', 'shields', 'totalDamage', 'lastDamage', 'lastHealing', 'blockedAttacks', 'bonusSpinsEarned', 'healingReceived']) battle[key] = numeric(battle[key])
  battle.hp = Math.min(maxHp, battle.hp + hpIncrease)
  battle.bossHp = Math.min(stageConfig.maxHp, battle.bossHp)
  battle.shields = Math.min(ARCADE_CONFIG.maxShields, battle.shields)
  battle.grid = isValidGrid(oldBattle.grid) ? oldBattle.grid : createRun().grid
  battle.matches = Array.isArray(oldBattle.matches) ? oldBattle.matches.filter((entry) => SYMBOL_IDS.has(entry?.id) && Array.isArray(entry.cells) && entry.cells.every((cell) => /^\d-\d$/.test(cell)) && Number.isInteger(entry.lineIndex) && entry.lineIndex >= 0 && entry.lineIndex < 5) : []
  battle.log = (Array.isArray(oldBattle.log) ? oldBattle.log : []).filter((entry) => entry && Number.isFinite(entry.turn)).slice(0, 6).map((entry) => ({ turn: numeric(entry.turn), damage: numeric(entry.damage), healing: numeric(entry.healing), attack: entry.attack === -1 ? -1 : numeric(entry.attack), ability: ABILITY_IDS.has(entry.ability) ? entry.ability : null }))
  battle.lastEffect = oldBattle.lastEffect ? Object.fromEntries(['damage', 'heroDamage', 'baseHeroDamage', 'abilityDamage', 'criticalDamage', 'extraSpins', 'shields', 'healing'].map((key) => [key, numeric(oldBattle.lastEffect[key])])) : null
  if (battle.lastEffect) battle.lastEffect.criticalDamage = Math.min(battle.lastEffect.damage, battle.lastEffect.criticalDamage)
  battle.lastAbility = ABILITY_IDS.has(oldBattle.lastAbility) ? oldBattle.lastAbility : null
  battle.secondWindUsed = Boolean(oldBattle.secondWindUsed)
  battle.secondWindTriggered = Boolean(oldBattle.secondWindTriggered)
  battle.lastAttack = oldBattle.lastAttack === -1 ? -1 : numeric(oldBattle.lastAttack)
  battle.lastBlockSource = ['rune', 'shield'].includes(oldBattle.lastBlockSource) ? oldBattle.lastBlockSource : null
  battle.lastBreakdown = oldBattle.lastBreakdown && typeof oldBattle.lastBreakdown === 'object' ? Object.fromEntries(['base', 'upgrades', 'rune'].map((key) => [key, numeric(oldBattle.lastBreakdown[key])])) : null
  if (source.status === 'fighting' && (!battle.hp || !battle.bossHp || !battle.spins)) return empty
  const rune = RUNES.find((entry) => entry.id === source.activeRune?.id)
  const remaining = Math.floor(numeric(source.activeRune?.remaining, 0, rune?.duration || 0))
  const run = {
    ...source, stage, upgrades, stageConfig, battle, maxHp,
    maxStage: Math.max(stage, Math.floor(numeric(source.maxStage, stage))),
    seed: numeric(source.seed) >>> 0,
    recordAtStart: numeric(source.recordAtStart, stats.bestStage),
    totalDamage: numeric(source.totalDamage), totalSpins: numeric(source.totalSpins), defeatedBosses: numeric(source.defeatedBosses),
    startedAt: ISO(source.startedAt) ? source.startedAt : new Date().toISOString(),
    endedAt: ISO(source.endedAt) ? source.endedAt : null,
    activeRune: rune && remaining ? { id: rune.id, remaining } : null,
    preparedRune: RUNE_IDS.has(source.preparedRune) ? source.preparedRune : null,
    runeHistory: runeCounts(source.runeHistory),
    recorded: Boolean(source.recorded || (version < 2 && source.status === 'defeated')),
    choices: [...new Set(Array.isArray(source.choices) ? source.choices : [])].filter((id) => REWARDS.some((entry) => entry.id === id && (entry.type === 'rune' || (upgrades[id] || 0) < entry.maxLevel))).slice(0, 3),
    selectedReward: REWARDS.some((entry) => entry.id === source.selectedReward) ? source.selectedReward : null,
    defeatReason: source.defeatReason === 'hp' ? 'hp' : 'spins',
  }
  battle.status = ['choosing-reward', 'transitioning'].includes(run.status) ? 'won' : run.status === 'defeated' ? 'lost' : 'active'
  if (run.status === 'choosing-reward' && run.choices.length < 3) run.choices = [...new Set([...run.choices, ...generateRewardChoices(run)])].slice(0, 3)
  if (run.status === 'transitioning' && !run.selectedReward) return empty
  return { run, stats, pending: run.status === 'fighting' && isValidGrid(saved.pending) ? saved.pending : null }
}

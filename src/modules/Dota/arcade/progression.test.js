import { describe, expect, it } from 'vitest'

import { createArcadeStore } from '@/modules/Dota/store/arcade'

import {
  applyUpgrade, createArcadeRun, resolveArcadeTurn, startNextArcadeStage
} from './arcade-engine'
import { getBuildSummary } from './build-summary'
import { resolveArcadeEffect } from './effect-resolver'
import { generateRewardChoices, REWARDS } from './reward-generator'
import { recordFinishedRun } from './run-records'
import { getRuneValues, RUNES } from './runes'
import { normalizeArcadeState } from './save-normalizer'
import { getStageConfig } from './stage-config'
import { UPGRADES } from './upgrades'

import { seededRandom } from '@/lib/random'

const fresh = () => createArcadeRun({ id: 'progression', seed: 1, now: '2026-01-01T00:00:00Z' }, seededRandom(1))
const grid = (id) => Array.from({ length: 5 }, () => Array(3).fill(id))
const empty = Array.from({ length: 5 }, (_, col) => Array(3).fill(['axe', 'invoker', 'drow-ranger', 'juggernaut', 'crystal-maiden'][col]))
const memory = () => {
  const values = new Map()
  return { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) }
}

describe('reward quality and exact build values', () => {
  it('restores level-30 upgrades and their live resources without truncation', () => {
    const upgrades = Object.fromEntries(UPGRADES.map((entry) => [entry.id, 30]))
    const run = { ...fresh(), stage: 30, maxStage: 30, upgrades, maxHp: 700, battle: { ...fresh().battle, hp: 650, shields: 30 } }
    const restored = normalizeArcadeState({ run }, 2).run
    expect(restored.upgrades).toEqual(upgrades)
    expect(restored.maxHp).toBe(700)
    expect(restored.battle.hp).toBe(650)
    expect(restored.battle.shields).toBe(30)
    expect(getBuildSummary(restored).bonuses.spins).toBe(60)
    expect(getBuildSummary(restored).bonuses.heroBonus).toBe(4.5)
  })
  it('keeps former maximum upgrades eligible for further development', () => {
    const run = { ...fresh(), upgrades: { 'blade-mastery': 3, 'second-wind': 2 } }
    expect(applyUpgrade({ ...run, status: 'choosing-reward', choices: ['blade-mastery'] }, 'blade-mastery').upgrades['blade-mastery']).toBe(4)
    expect(applyUpgrade({ ...run, status: 'choosing-reward', choices: ['second-wind'] }, 'second-wind').upgrades['second-wind']).toBe(3)
  })
  it.each([7, 29, 30])('continues past stage %s without a level cap', (stage) => {
    const run = { ...fresh(), stage, maxStage: stage, stageConfig: getStageConfig(stage) }
    const won = resolveArcadeTurn({ ...run, battle: { ...run.battle, bossHp: 1 } }, grid('juggernaut'))
    const chosen = applyUpgrade(won, won.choices[0])
    const next = startNextArcadeStage(chosen, seededRandom(stage))
    expect(next.status).toBe('fighting')
    expect(next.stage).toBe(stage + 1)
    expect(next.maxStage).toBe(stage + 1)
    expect(next.battle.bossHp).toBe(next.stageConfig.maxHp)
    expect(normalizeArcadeState({ run: next }, 2).run.stage).toBe(stage + 1)
  })
  it('never offers three identical types when alternatives exist', () => {
    for (let seed = 0; seed < 3000; seed++) {
      const level = seed % 2 ? 30 : 3
      const run = { ...fresh(), seed, upgrades: { 'blade-mastery': level } }
      const choices = generateRewardChoices(run)
      expect(new Set(choices).size).toBe(3)
      expect(new Set(choices.map((id) => REWARDS.find((entry) => entry.id === id).type)).size).toBeGreaterThan(1)
      if (level === 30) expect(choices).not.toContain('blade-mastery')
    }
  })
  it('safely falls back when all permanent upgrades are maxed', () => {
    const run = { ...fresh(), upgrades: Object.fromEntries(UPGRADES.map((entry) => [entry.id, entry.maxLevel])) }
    expect(generateRewardChoices(run).every((id) => RUNES.some((entry) => entry.id === id))).toBe(true)
    expect(generateRewardChoices(run, seededRandom(1), { disabledIds: REWARDS.map((entry) => entry.id) })).toEqual([])
  })
  it('build summary reads the engine bonuses and live resources', () => {
    const run = { ...fresh(), upgrades: { 'blade-mastery': 2, 'extra-charges': 3, vitality: 2 }, maxHp: 140, battle: { ...fresh().battle, hp: 37, shields: 2 } }
    const summary = getBuildSummary(run)
    expect(summary.bonuses.heroBonus).toBeCloseTo(0.3)
    expect(summary.bonuses.spins).toBe(6)
    expect(summary.groups.find((entry) => entry.id === 'defense').rows).toContainEqual(['hp', 37])
  })
  it('Arcane Knowledge affects advanced combinations rather than duplicating Blade Mastery', () => {
    const run = { ...fresh(), upgrades: { 'arcane-knowledge': 3 } }
    expect(resolveArcadeEffect([{ id: 'juggernaut', count: 3 }], run).damage).toBe(48)
    expect(resolveArcadeEffect([{ id: 'juggernaut', count: 4 }], run).damage).toBe(168)
  })
  it('level-one Artifact Mastery improves a single spin or shield charge', () => {
    const run = { ...fresh(), upgrades: { 'artifact-mastery': 1 } }
    expect(resolveArcadeEffect([{ id: 'butterfly', count: 3 }], run).extraSpins).toBe(2)
    expect(resolveArcadeEffect([{ id: 'black-king-bar', count: 3 }], run).shields).toBe(2)
  })
  it('damage breakdown sums to actual capped damage on killing blows', () => {
    const run = { ...fresh(), upgrades: { 'blade-mastery': 3 }, activeRune: { id: 'double-damage', remaining: 6 } }
    const next = resolveArcadeTurn({ ...run, battle: { ...run.battle, bossHp: 10 } }, grid('juggernaut'))
    expect(Object.values(next.battle.lastBreakdown).reduce((a, b) => a + b, 0)).toBe(10)
    expect(next.battle.lastDamage).toBe(10)
  })
  it('counts blocks and records Second Wind feedback without repeating it', () => {
    const run = { ...fresh(), upgrades: { 'second-wind': 1 }, battle: { ...fresh().battle, hp: 1, turn: 2 } }
    const revived = resolveArcadeTurn(run, empty)
    expect(revived.battle.secondWindTriggered).toBe(true)
    expect(resolveArcadeTurn(revived, empty).battle.secondWindTriggered).toBe(false)
    const blocked = resolveArcadeTurn({ ...fresh(), activeRune: { id: 'invisibility', remaining: 2 }, battle: { ...fresh().battle, turn: 2 } }, empty)
    expect(blocked.battle).toMatchObject({ blockedAttacks: 1, lastBlockSource: 'rune' })
    expect(blocked.activeRune.remaining).toBe(1)
  })
  it('tracks a rune activation once across the stage transition', () => {
    const won = resolveArcadeTurn({ ...fresh(), battle: { ...fresh().battle, bossHp: 1 } }, grid('juggernaut'))
    const chosen = applyUpgrade({ ...won, choices: ['haste'] }, 'haste')
    const next = startNextArcadeStage(chosen, seededRandom(1))
    expect(next.runeHistory).toEqual({ haste: 1 })
    expect(startNextArcadeStage(next, seededRandom(1))).toBe(next)
    expect(getRuneValues(RUNES.find((entry) => entry.id === 'haste')).spins).toBe(6)
  })
})

describe('bounded records and compatible saves', () => {
  it('keeps exactly ten recent results and lifetime totals without duplicate recording', () => {
    let stats = { bestStage: 0, runs: 14, finished: 0, bosses: 0, damage: 0, spins: 0 }
    for (let i = 1; i <= 14; i++) {
      const run = { ...fresh(), id: `run-${i}`, status: 'defeated', maxStage: i, endedAt: '2026-01-01T00:02:00Z', defeatReason: 'spins' }
      const recorded = recordFinishedRun(stats, run)
      stats = recorded.stats
      expect(recordFinishedRun(stats, recorded.run).stats).toBe(stats)
    }
    expect(stats.recent).toHaveLength(10)
    expect(stats.recent[0].id).toBe('run-14')
    expect(stats.finished).toBe(14)
    expect(stats.measuredRuns).toBe(14)
    expect(stats.stageTotal).toBe(105)
    expect(stats.longestSeconds).toBe(120)
  })
  it('deduplicates after reload and retains the finished result', async () => {
    const storage = memory()
    const store = createArcadeStore(storage)
    store.setState({ run: { ...fresh(), battle: { ...fresh().battle, spins: 1 } }, pending: empty })
    store.getState().finishSpin()
    const restored = createArcadeStore(storage)
    await restored.persist.rehydrate()
    restored.getState().finishSpin()
    expect(restored.getState().stats.measuredRuns).toBe(1)
    expect(restored.getState().stats.recent).toHaveLength(1)
    expect(restored.getState().run.recorded).toBe(true)
  })
  it('migrates a version-one active run, preserving stage, choices, HP gain and records', () => {
    const before = { ...fresh(), maxHp: 115, upgrades: { vitality: 1 }, battle: { ...fresh().battle, hp: 37 } }
    const migrated = normalizeArcadeState({ run: before, stats: { bestStage: 9, finished: 4 } }, 1)
    expect(migrated.run.maxHp).toBe(120)
    expect(migrated.run.battle.hp).toBe(42)
    expect(migrated.stats).toMatchObject({ bestStage: 9, finished: 4, measuredRuns: 0 })
    expect(normalizeArcadeState(migrated, 2).run.battle.hp).toBe(42)
  })
  it.each([null, {}, { run: {} }, { run: { status: 'fighting', stage: NaN } }, { run: { status: 'transitioning', id: 'bad', stage: 1, battle: {} } }])('does not crash on incomplete saves %#', (value) => {
    const result = normalizeArcadeState(value, 1)
    expect(result.run.status).toBe('idle')
    expect(result.stats.recent).toEqual([])
  })
  it('normalizes missing optional fields and rejects invalid pending grids', () => {
    const result = normalizeArcadeState({ run: { ...fresh(), upgrades: undefined, runeHistory: undefined, battle: { hp: 40, bossHp: 300, spins: 8 } }, pending: [['no-such-hero']] })
    expect(result.run.battle.hp).toBe(40)
    expect(result.run.battle.matches).toEqual([])
    expect(result.run.battle.log).toEqual([])
    expect(result.pending).toBeNull()
    expect(result.run.runeHistory).toEqual({})
  })
  it('keeps legitimate reward offers stable when hydrating', () => {
    const won = resolveArcadeTurn({ ...fresh(), battle: { ...fresh().battle, bossHp: 1 } }, grid('juggernaut'))
    expect(normalizeArcadeState({ run: won }).run.choices).toEqual(won.choices)
  })
  it('scales stage HP monotonically through elite exits and stage 1000', () => {
    for (let stage = 2; stage <= 1000; stage++) expect(getStageConfig(stage).maxHp).toBeGreaterThan(getStageConfig(stage - 1).maxHp)
  })
})


it('does not count the same critical damage twice when Phantom Assassin meets Daedalus', () => {
  const result = resolveArcadeEffect([{ id: 'phantom-assassin', count: 3 }, { id: 'daedalus', count: 3 }], { ...fresh(), upgrades: { 'critical-power': 1 } })
  expect(result.damage).toBe(122)
  expect(result.snapshot.criticalDamage).toBeLessThanOrEqual(result.snapshot.damage)
})

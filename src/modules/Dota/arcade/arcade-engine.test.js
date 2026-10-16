import { describe, expect, it } from 'vitest'

import { createArcadeStore } from '@/modules/Dota/store/arcade'
import { useGameStore } from '@/modules/Dota/store/game'

import { createRun, resolveTurn } from '@/modules/Dota/engine/battle'
import { calculateDamage } from '@/modules/Dota/engine/damage'

import {
  applyUpgrade, completeArcadeStage, createArcadeRun, finishArcadeRun, migrateArcadeState, resolveArcadeTurn, startNextArcadeStage
} from './arcade-engine'
import { resolveArcadeEffect } from './effect-resolver'
import { MODIFIERS } from './modifiers'
import { generateRewardChoices } from './reward-generator'
import { activateRune, consumeRune, RUNES } from './runes'
import { getStageConfig } from './stage-config'
import { getBonuses, UPGRADES } from './upgrades'

import { seededRandom } from '@/lib/random'

const GRID = Array.from({ length: 5 }, () => Array(3).fill('juggernaut'))
const EMPTY_GRID = Array.from({ length: 5 }, (_, col) => Array(3).fill(['axe', 'invoker', 'drow-ranger', 'juggernaut', 'crystal-maiden'][col]))
const match = (id, count = 3) => ({ id, count })
const fresh = () => createArcadeRun({ id: 'test-run', seed: 42, record: 0 }, seededRandom(12))
const win = (run = fresh()) => resolveArcadeTurn({ ...run, battle: { ...run.battle, bossHp: 1 } }, GRID)
const offer = (id, run = win()) => ({ ...run, choices: [id] })
const memoryStorage = () => {
  const data = new Map()
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: (key) => data.delete(key) }
}

describe('stages and rewards', () => {
  it('scales endlessly and empowers every fifth stage', () => {
    expect(getStageConfig(1)).toMatchObject({ maxHp: 500, damage: 4, spins: 22, elite: false })
    for (let stage = 2; stage < 100; stage++) {
      expect(getStageConfig(stage).maxHp).toBeGreaterThan(getStageConfig(stage - 1).maxHp)
      expect(getStageConfig(stage).elite).toBe(stage % 5 === 0)
    }
    expect(getStageConfig(100).maxHp).toBeGreaterThan(getStageConfig(99).maxHp)
  })
  it('gives exactly three distinct and deterministic offers', () => {
    for (let seed = 0; seed < 250; seed++) {
      const run = { ...fresh(), seed }
      const offers = generateRewardChoices(run)
      expect(new Set(offers).size).toBe(3)
      expect(generateRewardChoices(run)).toEqual(offers)
    }
  })
  it('still offers three different runes when all upgrades are maxed', () => {
    const run = { ...fresh(), upgrades: Object.fromEntries(UPGRADES.map((entry) => [entry.id, entry.maxLevel])) }
    const choices = generateRewardChoices(run)
    expect(new Set(choices).size).toBe(3)
    expect(choices.every((id) => RUNES.some((entry) => entry.id === id))).toBe(true)
  })
  it.each(UPGRADES.map((entry) => [entry.id, entry.maxLevel]))('caps %s at level %s', (id, max) => {
    let run = win()
    for (let i = 0; i < max; i++) run = applyUpgrade(offer(id, { ...run, status: 'choosing-reward' }), id)
    const capped = offer(id, { ...run, status: 'choosing-reward' })
    expect(applyUpgrade(capped, id)).toBe(capped)
    expect(run.upgrades[id]).toBe(max)
  })
  it('uses additive levels rather than compounding', () => {
    expect(getBonuses({ 'blade-mastery': 3 }).heroBonus).toBeCloseTo(0.45)
    expect(resolveArcadeEffect([match('juggernaut')], { ...fresh(), upgrades: { 'blade-mastery': 3 } }).damage).toBe(70)
  })
  it('rejects invalid and duplicate reward selections and premature transitions', () => {
    const initial = fresh()
    expect(startNextArcadeStage(initial, seededRandom(1))).toBe(initial)
    expect(applyUpgrade(initial, 'vitality')).toBe(initial)
    const cleared = offer('vitality')
    expect(applyUpgrade(cleared, 'blade-mastery')).toBe(cleared)
    const selected = applyUpgrade(cleared, 'vitality')
    expect(applyUpgrade(selected, 'vitality')).toBe(selected)
    const next = startNextArcadeStage(selected, seededRandom(1))
    expect(next).toMatchObject({ status: 'fighting', stage: 2 })
    expect(startNextArcadeStage(next, seededRandom(1))).toBe(next)
  })
})

describe('health and transitions', () => {
  it('carries current HP and resets spins with per-stage bonuses', () => {
    const run = applyUpgrade(offer('extra-charges', win({ ...fresh(), battle: { ...fresh().battle, hp: 37, spins: 7 } })), 'extra-charges')
    const next = startNextArcadeStage(run, seededRandom(2))
    expect(next.battle.hp).toBe(37)
    expect(next.battle.spins).toBe(24)
    expect(next.battle.turn).toBe(0)
  })
  it('Vitality increases current and maximum HP only by the new level increment', () => {
    let run = applyUpgrade(offer('vitality'), 'vitality')
    expect(run.maxHp).toBe(120)
    expect(run.battle.hp).toBe(120)
    run = applyUpgrade(offer('vitality', { ...run, status: 'choosing-reward' }), 'vitality')
    expect(run.maxHp).toBe(140)
    expect(run.battle.hp).toBe(140)
  })
  it('recovers HP once before offering rewards and respects maximum', () => {
    const base = { ...fresh(), upgrades: { 'battle-recovery': 3 }, battle: { ...fresh().battle, hp: 90 } }
    const run = win(base)
    expect(run.battle.hp).toBe(100)
    expect(completeArcadeStage(run)).toBe(run)
    expect(run.defeatedBosses).toBe(1)
  })
  it('Fortified Armor resets at stage entry rather than accumulating unused shields', () => {
    const run = applyUpgrade(offer('fortified-armor'), 'fortified-armor')
    const next = startNextArcadeStage({ ...run, battle: { ...run.battle, shields: 12 } }, seededRandom(1))
    expect(next.battle.shields).toBe(1)
  })
  it('Second Wind fires once per stage and never after defeat', () => {
    let run = { ...fresh(), upgrades: { 'second-wind': 2 }, battle: { ...fresh().battle, hp: 1, turn: 2 } }
    run = resolveArcadeTurn(run, EMPTY_GRID)
    expect(run.battle).toMatchObject({ hp: 40, secondWindUsed: true })
    run = resolveArcadeTurn({ ...run, battle: { ...run.battle, hp: 1, turn: 5 } }, EMPTY_GRID)
    expect(run.status).toBe('defeated')
    expect(run.defeatReason).toBe('hp')
    expect(resolveArcadeTurn(run, GRID)).toBe(run)
  })
  it('a kill on the final spin wins before retaliation', () => {
    const run = win({ ...fresh(), battle: { ...fresh().battle, spins: 1, hp: 1, turn: 2 } })
    expect(run.status).toBe('choosing-reward')
    expect(run.battle.hp).toBe(1)
  })
  it('terminates on zero spins and reports the reason', () => {
    const run = resolveArcadeTurn({ ...fresh(), battle: { ...fresh().battle, spins: 1 } }, EMPTY_GRID)
    expect(run.status).toBe('defeated')
    expect(run.defeatReason).toBe('spins')
    expect(finishArcadeRun(run, 'hp', 'later')).toBe(run)
  })
  it('caps turns even when artifacts repeatedly grant spins', () => {
    const run = resolveArcadeTurn({ ...fresh(), battle: { ...fresh().battle, turn: 99, spins: 200 } }, EMPTY_GRID)
    expect(run.status).toBe('defeated')
  })
})

describe('runes and boss modifiers', () => {
  it.each(RUNES.map((entry) => [entry.id]))('automatically consumes prepared %s on entry', (id) => {
    const selected = applyUpgrade(offer(id), id)
    const next = startNextArcadeStage(selected, seededRandom(1))
    expect(next.preparedRune).toBeNull()
    const rune = RUNES.find((entry) => entry.id === id)
    expect(next.activeRune?.id || null).toBe(rune.durationType === 'entry' ? null : id)
  })
  it('replaces a prepared rune and does not stack them', () => {
    const run = applyUpgrade(offer('haste', { ...win(), preparedRune: 'double-damage' }), 'haste')
    const next = startNextArcadeStage(run, seededRandom(1))
    expect(next.preparedRune).toBeNull()
    expect(next.activeRune).toBeNull()
    expect(next.battle.spins).toBe(28)
  })
  it('expires a duration on empty spins as well as winning spins', () => {
    let run = { ...fresh(), activeRune: { id: 'double-damage', remaining: 3 } }
    for (let i = 0; i < 3; i++) run = resolveArcadeTurn(run, EMPTY_GRID)
    expect(run.activeRune).toBeNull()
    expect(consumeRune({ id: 'arcane', remaining: 1 }, 'spins')).toBeNull()
  })
  it('Regeneration heals on entry only and is capped', () => {
    expect(activateRune({ hp: 90, spins: 22, shields: 0 }, 'regeneration', 100)).toMatchObject({ battle: { hp: 100 }, activeRune: null })
    expect(activateRune({ hp: 10, spins: 22, shields: 0 }, 'regeneration', 100).battle.hp).toBe(60)
  })
  it('Invisibility blocks exactly one attack before ordinary shields', () => {
    let run = { ...fresh(), activeRune: { id: 'invisibility', remaining: 1 }, battle: { ...fresh().battle, shields: 2, turn: 2 } }
    run = resolveArcadeTurn(run, EMPTY_GRID)
    expect(run.activeRune).toBeNull()
    expect(run.battle).toMatchObject({ shields: 2, lastAttack: -1, hp: 100 })
  })
  it('chooses no modifier until stage 3, exactly one afterward, including elites', () => {
    let run = fresh()
    for (let i = 1; i <= 15; i++) {
      expect(run.stageConfig.modifier !== null).toBe(i >= 3)
      expect(MODIFIERS.some((entry) => entry.id === run.stageConfig.modifier)).toBe(i >= 3)
      run = startNextArcadeStage(applyUpgrade(offer('haste', win(run)), 'haste'), seededRandom(i))
    }
  })
  it('applies each modifier numerically', () => {
    const base = getStageConfig(5)
    expect(getStageConfig(5, 'enraged').damage).toBeGreaterThan(base.damage)
    expect(getStageConfig(5, 'thick-hide').receivedDamage).toBe(0.9)
    expect(getStageConfig(5, 'exhaustion').spins).toBe(base.spins - 1)
    expect(getStageConfig(5, 'brutal-strikes').attackInterval).toBe(2)
  })
})

describe('item interactions and effect ordering', () => {
  it('Double Damage doubles Divine Rapier and Daedalus final damage', () => {
    const matches = [match('juggernaut'), match('divine-rapier'), match('daedalus')]
    const base = resolveArcadeEffect(matches, fresh())
    const doubled = resolveArcadeEffect(matches, { ...fresh(), activeRune: { id: 'double-damage', remaining: 3 } })
    expect(base.damage).toBe(192)
    expect(doubled.damage).toBe(384)
  })
  it('Arcane with Aghanim boosts hero abilities but not artifact damage or healing', () => {
    const result = resolveArcadeEffect([match('juggernaut'), match('divine-rapier'), match('aghanims-scepter'), match('healing-salve')], { ...fresh(), activeRune: { id: 'arcane', remaining: 5 } })
    expect(result.damage).toBe(Math.round(48 * 1.35 * 1.75 + 80 * 1.35))
    expect(result.healing).toBe(20)
  })
  it('Illusion does not echo Refresher, items or resources', () => {
    const run = { ...fresh(), activeRune: { id: 'illusion', remaining: 3 }, battle: { ...fresh().battle, lastEffect: { damage: 100, heroDamage: 100, extraSpins: 1, shields: 1, healing: 20 } } }
    const result = resolveArcadeEffect([match('juggernaut'), match('refresher-orb')], run)
    expect(result.damage).toBe(184)
    expect(result).toMatchObject({ extraSpins: 1, shields: 1, healing: 20 })
    const onlyOrb = resolveArcadeEffect([match('refresher-orb')], run)
    expect(onlyOrb.damage).toBe(100)
    expect(onlyOrb.snapshot).toEqual(run.battle.lastEffect)
  })
  it('does not store rune multipliers or Refresher copies in snapshots', () => {
    const base = fresh()
    const result = resolveArcadeEffect([match('juggernaut')], { ...base, activeRune: { id: 'double-damage', remaining: 3 } })
    expect(result.damage).toBe(96)
    expect(result.snapshot.damage).toBe(48)
    let snapshot = result.snapshot
    for (let i = 0; i < 50; i++) {
      const repeat = resolveArcadeEffect([match('refresher-orb', 5)], { ...base, battle: { ...base.battle, lastEffect: snapshot } })
      expect(repeat.damage).toBe(144)
      snapshot = repeat.snapshot
    }
  })
  it('Artifact Mastery strengthens supported damage multipliers', () => {
    const matches = [match('juggernaut'), match('daedalus')]
    const effect = resolveArcadeEffect(matches, { ...fresh(), upgrades: { 'artifact-mastery': 3 } })
    expect(effect.damage).toBe(90)
  })
  it('combines Shield rune and Black King Bar without losing charges', () => {
    const activated = activateRune({ ...fresh().battle, turn: 2 }, 'shield', 100)
    const grid = Array.from({ length: 5 }, () => Array(3).fill('black-king-bar'))
    const run = resolveArcadeTurn({ ...fresh(), battle: activated.battle }, grid)
    expect(run.battle.shields).toBe(18)
    expect(run.battle.hp).toBe(100)
  })
  it('adds Butterfly spins to the existing Extra Charges budget', () => {
    const selected = applyUpgrade(offer('extra-charges'), 'extra-charges')
    const run = startNextArcadeStage(selected, seededRandom(1))
    const grid = Array.from({ length: 5 }, () => Array(3).fill('butterfly'))
    expect(resolveArcadeTurn(run, grid).battle.spins).toBe(31)
  })
  it('caps combined Regeneration and Healing Salve at upgraded maximum HP', () => {
    const battle = activateRune({ ...fresh().battle, hp: 80 }, 'regeneration', 115).battle
    const grid = Array.from({ length: 5 }, () => Array(3).fill('healing-salve'))
    const run = resolveArcadeTurn({ ...fresh(), maxHp: 115, battle }, grid)
    expect(run.battle.hp).toBe(115)
  })
})

describe('persistence, records and Classic isolation', () => {
  it('rehydrates a pending spin once and retains independent Classic state', async () => {
    const classic = useGameStore.getState().run
    const storage = memoryStorage()
    const store = createArcadeStore(storage)
    store.getState().newRun(seededRandom(5))
    store.getState().beginSpin(seededRandom(20))
    const restored = createArcadeStore(storage)
    await restored.persist.rehydrate()
    expect(restored.getState().run.totalSpins).toBe(1)
    expect(restored.getState().pending).toBeNull()
    restored.getState().finishSpin()
    expect(restored.getState().run.totalSpins).toBe(1)
    expect(useGameStore.getState().run).toBe(classic)
  })
  it('persists reward offers, HP, upgrades, active rune and selected reward without double grants', async () => {
    const storage = memoryStorage()
    const store = createArcadeStore(storage)
    store.setState({ run: { ...offer('vitality'), choices: ['vitality', 'haste', 'blade-mastery'] } })
    const restored = createArcadeStore(storage)
    await restored.persist.rehydrate()
    expect(restored.getState().run.choices).toEqual(['vitality', 'haste', 'blade-mastery'])
    expect(restored.getState().chooseReward('vitality')).toBe(true)
    expect(restored.getState().chooseReward('vitality')).toBe(false)
    const afterChoice = createArcadeStore(storage)
    await afterChoice.persist.rehydrate()
    expect(afterChoice.getState().run).toMatchObject({ status: 'transitioning', maxHp: 120, upgrades: { vitality: 1 } })
    expect(afterChoice.getState().run.battle.hp).toBe(120)
    afterChoice.getState().nextStage(seededRandom(1))
    afterChoice.setState((state) => ({ run: { ...state.run, activeRune: { id: 'arcane', remaining: 2 } } }))
    const active = createArcadeStore(storage)
    await active.persist.rehydrate()
    expect(active.getState().run).toMatchObject({ stage: 2, activeRune: { id: 'arcane', remaining: 2 }, battle: { hp: 120 } })
  })
  it('records a stage once and keeps records across new runs and reloads', async () => {
    const storage = memoryStorage()
    const store = createArcadeStore(storage)
    store.setState({ run: applyUpgrade(offer('haste'), 'haste') })
    store.getState().nextStage(seededRandom(1))
    expect(store.getState().stats.bestStage).toBe(2)
    store.getState().newRun(seededRandom(2))
    const restored = createArcadeStore(storage)
    await restored.persist.rehydrate()
    expect(restored.getState().stats.bestStage).toBe(2)
    expect(restored.getState().run.upgrades).toEqual(expect.objectContaining({}))
    expect(Object.values(restored.getState().run.upgrades).some(Boolean)).toBe(false)
  })
  it('deduplicates terminal stats and boss victories', () => {
    const store = createArcadeStore(memoryStorage())
    store.setState({ run: { ...fresh(), battle: { ...fresh().battle, bossHp: 1 } }, pending: GRID })
    store.getState().finishSpin()
    store.getState().finishSpin()
    expect(store.getState().stats.bosses).toBe(1)
    store.setState({ run: { ...fresh(), battle: { ...fresh().battle, spins: 1 } }, pending: EMPTY_GRID })
    store.getState().finishSpin()
    store.getState().finishSpin()
    expect(store.getState().stats.finished).toBe(1)
  })
  it('migrates obsolete snapshots while preserving records', () => {
    expect(migrateArcadeState({ run: { broken: true }, stats: { bestStage: 9 } }, 0)).toMatchObject({ run: { status: 'idle' }, stats: { bestStage: 9 }, pending: null })
  })
  it('keeps Classic balance, item repeats and single-battle victory unchanged', () => {
    expect(createRun()).toMatchObject({ hp: 100, bossHp: 1000, spins: 22 })
    const first = resolveTurn(createRun(), GRID)
    expect(first.lastDamage).toBe(960)
    expect(resolveTurn(first, GRID).status).toBe('won')
    expect(calculateDamage([match('divine-rapier'), match('daedalus')]).damage).toBe(120)
    expect(calculateDamage([match('refresher-orb')], 60).damage).toBe(60)
  })
})

describe('additional invariants', () => {
  it('applies critical, ability and elite hunter bonuses in their proper scope', () => {
    expect(resolveArcadeEffect([match('phantom-assassin')], { ...fresh(), upgrades: { 'critical-power': 3 } }).damage).toBe(123)
    expect(resolveArcadeEffect([match('juggernaut')], { ...fresh(), upgrades: { 'arcane-knowledge': 3 } }).damage).toBe(48)
    const hunter = { ...fresh(), upgrades: { 'roshan-hunter': 3 } }
    expect(resolveArcadeEffect([match('juggernaut')], hunter).damage).toBe(48)
    expect(resolveArcadeEffect([match('juggernaut')], { ...hunter, stageConfig: getStageConfig(5) }).damage).toBe(84)
    expect(resolveArcadeEffect([match('juggernaut')], { ...fresh(), stageConfig: getStageConfig(3, 'thick-hide') }).damage).toBe(43)
  })
  it('retains a prepared rune through reload and resets Second Wind next stage', async () => {
    const storage = memoryStorage()
    const store = createArcadeStore(storage)
    store.setState({ run: applyUpgrade(offer('haste', { ...win(), battle: { ...win().battle, secondWindUsed: true } }), 'haste') })
    const restored = createArcadeStore(storage)
    await restored.persist.rehydrate()
    expect(restored.getState().run.preparedRune).toBe('haste')
    restored.getState().nextStage(seededRandom(4))
    expect(restored.getState().run.battle).toMatchObject({ secondWindUsed: false, spins: 28 })
  })
})

import { describe, expect, it } from 'vitest'

import { chooseReward } from '../../../../scripts/arcade-simulation.js'

import { createArcadeRun, resolveArcadeTurn } from './arcade-engine'
import {
  getBuildProgress, getCappedDamageBreakdown, getDamageSources, getHeroPreview, getItemPreview
} from './build-impact'
import { normalizeArcadeState } from './save-normalizer'
import { getStageConfig } from './stage-config'
import { UPGRADES } from './upgrades'

import { seededRandom } from '@/lib/random'

const fresh = () => createArcadeRun({ id: 'impact', seed: 42 }, seededRandom(42))
const grid = Array.from({ length: 5 }, () => Array(3).fill('juggernaut'))

describe('visible build contribution', () => {
  it('shares overkill proportionally without inventing a rune contribution', () => {
    for (let base = 1; base < 100; base++) {
      const effect = { damage: 100, breakdown: { base, upgrades: 100 - base, rune: 0 } }
      for (let dealt = 1; dealt <= 100; dealt++) {
        const sources = getCappedDamageBreakdown(effect, dealt)
        expect(sources.base + sources.upgrades + sources.rune).toBe(dealt)
        expect(sources.rune).toBe(0)
        expect(Math.min(...Object.values(sources))).toBeGreaterThanOrEqual(0)
      }
    }
  })
  it('compares identical combinations using real modifier and rune math', () => {
    const run = { ...fresh(), upgrades: { 'blade-mastery': 2, 'arcane-knowledge': 1 }, activeRune: { id: 'double-damage', remaining: 6 }, stageConfig: getStageConfig(5, 'thick-hide') }
    const before = structuredClone(run)
    expect(getHeroPreview(run, 'juggernaut', 4)).toEqual({ id: 'juggernaut', base: 86, build: 134, total: 268, bonus: 48, rune: 134 })
    expect(run).toEqual(before)
  })
  it('shows why advanced matches benefit from Arcane Knowledge', () => {
    const run = { ...fresh(), upgrades: { 'arcane-knowledge': 2 } }
    expect(getHeroPreview(run, 'juggernaut', 3).bonus).toBe(0)
    expect(getHeroPreview(run, 'juggernaut', 4).bonus).toBe(48)
  })
  it('shows Artifact Mastery resources with the real rounding and spin cap', () => {
    const run = { ...fresh(), upgrades: { 'artifact-mastery': 30 } }
    expect(getItemPreview(run, 'butterfly', 'extraSpins', 5)).toEqual({ base: 3, value: 8 })
    expect(getItemPreview(run, 'black-king-bar', 'shields', 5)).toEqual({ base: 3, value: 26 })
    expect(getItemPreview(run, 'healing-salve', 'healing')).toEqual({ base: 20, value: 170 })
  })
  it('adds damage sources once, caps killing blows and survives hydration', () => {
    const run = { ...fresh(), upgrades: { 'blade-mastery': 3 }, activeRune: { id: 'double-damage', remaining: 6 } }
    const next = resolveArcadeTurn(run, grid)
    expect(getDamageSources(next).tracked).toBe(next.totalDamage)
    expect(next.damageSources.upgrades).toBeGreaterThan(0)
    expect(next.damageSources.rune).toBeGreaterThan(0)
    const restored = normalizeArcadeState({ run: next }).run
    expect(restored.damageSources).toEqual(next.damageSources)
    expect(resolveArcadeTurn(restored, grid)).toBe(restored)
  })
  it('does not invent damage attribution for old runs', () => {
    const old = { ...fresh(), totalDamage: 100, damageSources: undefined }
    const normalized = normalizeArcadeState({ run: old }).run
    expect(getDamageSources(normalized).tracked).toBe(0)
    const next = resolveArcadeTurn(normalized, grid)
    expect(getDamageSources(next).tracked).toBe(next.totalDamage - 100)
  })
  it('bounds corrupted source counts by actual historical damage', () => {
    const run = { ...fresh(), totalDamage: 40, damageSources: { base: -2, upgrades: Infinity, rune: 999 } }
    const normalized = normalizeArcadeState({ run }).run
    expect(normalized.damageSources).toEqual({ base: 0, upgrades: 0, rune: 40 })
  })
  it('distinguishes one maximum upgrade from the complete build', () => {
    const run = { ...fresh(), stage: 30, upgrades: { 'blade-mastery': 30 } }
    expect(getBuildProgress(run)).toMatchObject({ highest: 30, maximum: 30, total: 30, capacity: 300 })
    const all = Object.fromEntries(UPGRADES.map((entry) => [entry.id, 30]))
    expect(getBuildProgress({ ...run, upgrades: all }).total).toBe(300)
  })
  it('focused policies use offered rewards and remain deterministic', () => {
    const run = { ...fresh(), choices: ['vitality', 'blade-mastery', 'shield'] }
    expect(chooseReward(run, 'focus:blade-mastery', seededRandom(1))).toBe('blade-mastery')
    const fallback = chooseReward(run, 'focus:artifact-mastery', seededRandom(1))
    expect(run.choices).toContain(fallback)
    expect(fallback).toBe(chooseReward(run, 'adaptive', seededRandom(1)))
  })
})

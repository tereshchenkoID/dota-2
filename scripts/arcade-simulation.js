import { ARCADE_CONFIG } from '@/modules/Dota/arcade/arcade-config'
import {
  applyUpgrade, createArcadeRun, resolveArcadeTurn, startNextArcadeStage 
} from '@/modules/Dota/arcade/arcade-engine'
import { REWARDS } from '@/modules/Dota/arcade/reward-generator'
import { RUNES } from '@/modules/Dota/arcade/runes'
import { getStageConfig } from '@/modules/Dota/arcade/stage-config'
import { getBonuses, UPGRADES } from '@/modules/Dota/arcade/upgrades'
import { generateGrid } from '@/modules/Dota/engine/spin'

import { seededRandom } from '@/lib/random'

export const STRATEGIES = ['random', 'damage', 'defense', 'utility', 'balanced', 'adaptive']
const PRIORITIES = {
  damage: { offense: 9, defense: 1, utility: 3, rune: 3 },
  defense: { offense: 2, defense: 9, utility: 3, rune: 3 },
  utility: { offense: 2, defense: 2, utility: 9, rune: 4 },
  balanced: { offense: 5, defense: 5, utility: 5, rune: 4 },
  adaptive: { offense: 5, defense: 5, utility: 5, rune: 4 },
}

// Decisions use completed battle observations, visible HP, build and next stage
// preview only. Combat/modifier streams are paired across all strategies.
export function chooseReward(run, strategy, random) {
  if (strategy === 'random') return run.choices[Math.floor(random() * run.choices.length)]
  const health = run.battle.hp / run.maxHp
  const nextStage = getStageConfig(run.stage + 1)
  const nearLimit = run.battle.turn >= (run.stageConfig.spins + getBonuses(run.upgrades).spins) * 0.8
  const ranked = run.choices.map((id) => {
    const entry = REWARDS.find((reward) => reward.id === id)
    let score = PRIORITIES[strategy][entry.type] + random() * 0.25
    if (['balanced', 'adaptive'].includes(strategy)) {
      if (['regeneration', 'vitality', 'battle-recovery', 'second-wind'].includes(id) && health < 0.55) score += 5
      if (id === 'regeneration' && health > 0.85) score -= 6
      if (id === 'extra-charges') score += nearLimit ? 4 : 1
      if (entry.type !== 'rune') score += 0.5 / (1 + (run.upgrades[id] || 0))
    }
    if (id === 'roshan-hunter' && !nextStage.elite) score -= 2
    if (strategy === 'damage' && ['double-damage', 'arcane', 'illusion'].includes(id)) score += 5
    if (strategy === 'defense' && ['regeneration', 'shield', 'invisibility'].includes(id)) score += 5
    if (strategy === 'utility' && id === 'haste') score += 5
    if (strategy === 'adaptive') {
      if (health < 0.4 && id === 'regeneration') score += 10
      if (health < 0.6 && ['fortified-armor', 'battle-recovery'].includes(id)) score += 3
      if (nearLimit && ['blade-mastery', 'arcane-knowledge', 'extra-charges', 'haste'].includes(id)) score += 5
      if (nextStage.elite && ['double-damage', 'haste', 'roshan-hunter', 'shield'].includes(id)) score += 4
      if (id === 'battle-recovery' && !run.upgrades[id] && run.stage < 7) score += 2
      if (health > 0.75 && entry.type === 'offense') score += 2
    }
    return { id, score }
  }).sort((a, b) => b.score - a.score)
  return ranked[0].id
}

export function simulate({ runs = 10000, seed = 20261016, strategies = STRATEGIES, disabledIds = [] } = {}) {
  const report = { runsPerStrategy: runs, seed, config: structuredClone(ARCADE_CONFIG), upgrades: UPGRADES, runes: RUNES, disabledIds, strategies: {} }
  for (const strategy of strategies) {
    const stages = [], distribution = {}, offered = {}, selected = {}, runes = {}
    let totalSpins = 0, totalDamage = 0, totalUpgrades = 0, choices = 0, emptySpins = 0, hp = 0, spins = 0, censored = 0
    const perRun = []
    for (let index = 0; index < runs; index++) {
      const runSeed = (seed + Math.imul(index, 7919)) >>> 0
      const randomChoice = seededRandom(runSeed ^ 0xdeadbeef)
      const stageRandom = (stage, salt) => seededRandom((runSeed ^ Math.imul(stage, 104729) ^ salt) >>> 0)
      let combat = stageRandom(1, 13)
      let run = createArcadeRun({ id: `sim-${index}`, seed: runSeed, now: '2026-01-01T00:00:00.000Z' }, stageRandom(1, 29))
      let rune = null, acquired = 0
      while (run.status !== 'defeated' && run.stage <= 500) {
        if (run.status === 'fighting') {
          run = resolveArcadeTurn(run, generateGrid(combat), '2026-01-01T00:00:00.000Z', { disabledIds })
          emptySpins += Number(run.battle.matches.length === 0)
          if (run.status !== 'fighting' && rune) {
            const outcome = runes[rune] ||= { stages: 0, cleared: 0, damage: 0, turns: 0 }
            outcome.stages++
            outcome.cleared += Number(run.status === 'choosing-reward')
            outcome.damage += run.battle.totalDamage
            outcome.turns += run.battle.turn
          }
        } else if (run.status === 'choosing-reward') {
          for (const id of run.choices) offered[id] = (offered[id] || 0) + 1
          const id = chooseReward(run, strategy, randomChoice)
          selected[id] = (selected[id] || 0) + 1
          choices++
          acquired += Number(REWARDS.find((entry) => entry.id === id).type !== 'rune')
          run = applyUpgrade(run, id)
          rune = run.preparedRune
        } else if (run.status === 'transitioning') {
          run = startNextArcadeStage(run, stageRandom(run.stage + 1, 29))
          combat = stageRandom(run.stage, 13)
        } else throw new Error(`Unexpected state ${run.status}`)
      }
      stages.push(run.maxStage)
      perRun.push(run.maxStage)
      distribution[run.maxStage] = (distribution[run.maxStage] || 0) + 1
      totalSpins += run.totalSpins
      totalDamage += run.totalDamage
      totalUpgrades += acquired
      hp += Number(run.defeatReason === 'hp')
      spins += Number(run.defeatReason === 'spins')
      censored += Number(run.status !== 'defeated')
    }
    stages.sort((a, b) => a - b)
    report.strategies[strategy] = {
      meanStage: stages.reduce((a, b) => a + b, 0) / runs,
      medianStage: (stages[Math.floor((runs - 1) / 2)] + stages[Math.floor(runs / 2)]) / 2,
      reach5: stages.filter((stage) => stage >= 5).length / runs,
      reach10: stages.filter((stage) => stage >= 10).length / runs,
      reach15: stages.filter((stage) => stage >= 15).length / runs,
      reach30: stages.filter((stage) => stage >= 30).length / runs,
      maxStage: stages.at(-1),
      meanSpins: totalSpins / runs,
      meanUpgrades: totalUpgrades / runs,
      meanDamage: totalDamage / runs,
      emptySpinRate: emptySpins / totalSpins,
      estimatedMeanSeconds: (totalSpins * ARCADE_CONFIG.spinSeconds + choices * ARCADE_CONFIG.choiceSeconds) / runs,
      hpDefeatRate: hp / runs,
      spinsDefeatRate: spins / runs,
      distribution, censored,
      rewards: Object.fromEntries(REWARDS.map((entry) => [entry.id, { offered: offered[entry.id] || 0, selected: selected[entry.id] || 0, selectionRate: (selected[entry.id] || 0) / (offered[entry.id] || 1) }])),
      runes: Object.fromEntries(Object.entries(runes).map(([id, data]) => [id, { ...data, clearRate: data.cleared / data.stages, meanDamage: data.damage / data.stages }])),
      perRun,
    }
    process.stdout.write(`${strategy}: mean ${report.strategies[strategy].meanStage.toFixed(2)}, median ${report.strategies[strategy].medianStage}, reach5 ${(report.strategies[strategy].reach5 * 100).toFixed(1)}%, reach10 ${(report.strategies[strategy].reach10 * 100).toFixed(1)}%, reach30 ${(report.strategies[strategy].reach30 * 100).toFixed(1)}%\n`)
  }
  return report
}

export function formatReport(report) {
  let result = `# Arcade progression simulation\n\n${report.runsPerStrategy} runs per strategy. Seed ${report.seed}. Combat and modifier streams paired by run and stage across strategies.\n\n| Strategy | Mean | Median | Stage 5 | Stage 10 | Stage 15 | Stage 30 | Upgrades | Damage | Duration* | HP loss | Spins loss |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n`
  const percent = (value) => `${(value * 100).toFixed(1)}%`
  for (const [id, value] of Object.entries(report.strategies)) result += `| ${id} | ${value.meanStage.toFixed(2)} | ${value.medianStage} | ${percent(value.reach5)} | ${percent(value.reach10)} | ${percent(value.reach15)} | ${percent(value.reach30)} | ${value.meanUpgrades.toFixed(2)} | ${value.meanDamage.toFixed(0)} | ${value.estimatedMeanSeconds.toFixed(0)} s | ${percent(value.hpDefeatRate)} | ${percent(value.spinsDefeatRate)} |\n`
  result += '\n*Duration estimates animation plus 8 seconds per choice; it is not measured human play time. Rune clear rates are observational, not causal. Stage 500 is a simulation guard only; censored runs are reported separately.\n'
  for (const [id, value] of Object.entries(report.strategies)) {
    result += `\n## ${id}\n\nEmpty spins: ${percent(value.emptySpinRate)}. Max stage: ${value.maxStage}. Censored: ${value.censored}.\n\nDistribution: ${JSON.stringify(value.distribution)}\n\n| Reward | Offered | Chosen | Pick rate |\n|---|---:|---:|---:|\n`
    for (const [key, data] of Object.entries(value.rewards)) result += `| ${key} | ${data.offered} | ${data.selected} | ${percent(data.selectionRate)} |\n`
    result += '\n| Rune | Stages | Clear rate | Mean damage |\n|---|---:|---:|---:|\n'
    for (const [key, data] of Object.entries(value.runes)) result += `| ${key} | ${data.stages} | ${percent(data.clearRate)} | ${data.meanDamage.toFixed(0)} |\n`
  }
  return result
}

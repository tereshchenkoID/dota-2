import { mkdirSync, writeFileSync } from 'node:fs'
import { performance } from 'node:perf_hooks'

import { ARCADE_CONFIG } from '@/modules/Dota/arcade/arcade-config'
import {
  applyUpgrade, createArcadeRun, resolveArcadeTurn, startNextArcadeStage 
} from '@/modules/Dota/arcade/arcade-engine'
import { REWARDS } from '@/modules/Dota/arcade/reward-generator'
import { generateGrid } from '@/modules/Dota/engine/spin'

import { seededRandom } from '@/lib/random'

const RUNS = Math.max(1, Number(process.argv[2]) || 10000)
const SEED = Number(process.argv[3]) || 20261016
const STRATEGIES = ['random', 'damage', 'defensive', 'balanced']
const SCORE = {
  damage: { offense: 8, defense: 2, utility: 4, rune: 3 },
  defensive: { offense: 2, defense: 8, utility: 4, rune: 3 },
  balanced: { offense: 5, defense: 5, utility: 5, rune: 4 },
}

function choose(run, strategy, random) {
  if (strategy === 'random') return run.choices[Math.floor(random() * run.choices.length)]
  const ranked = run.choices.map((id) => {
    const entry = REWARDS.find((reward) => reward.id === id)
    let score = SCORE[strategy][entry.type] + random() * 0.5
    const health = run.battle.hp / run.maxHp
    if (['regeneration', 'vitality', 'battle-recovery', 'second-wind'].includes(id) && health < 0.5) score += strategy === 'damage' ? 1 : 6
    if (id === 'regeneration' && health > 0.85) score -= 4
    if (['double-damage', 'arcane', 'illusion', 'haste'].includes(id)) score += strategy === 'damage' ? 5 : 2
    if (id === 'roshan-hunter' && (run.stage + 1) % 5 !== 0) score -= 1
    if (id === 'extra-charges') score += 2
    if (strategy === 'balanced' && entry.type !== 'rune') score -= (run.upgrades[id] || 0) * 0.5
    return { id, score }
  }).sort((a, b) => b.score - a.score)
  return ranked[0].id
}

const report = { runsPerStrategy: RUNS, seed: SEED, generatedAt: new Date().toISOString(), config: ARCADE_CONFIG, strategies: {} }
for (const [strategyIndex, strategy] of STRATEGIES.entries()) {
  const started = performance.now()
  const stages = [], distribution = {}, choices = {}, offered = {}, runeStages = {}
  let spins = 0, bosses = 0, hpDefeats = 0, spinDefeats = 0, seconds = 0, censored = 0
  for (let index = 0; index < RUNS; index++) {
    const random = seededRandom((SEED + index * 7919 + strategyIndex * 104729) >>> 0)
    let run = createArcadeRun({ id: `${strategy}-${index}`, seed: Math.floor(random() * 4294967296), now: '2026-01-01T00:00:00.000Z' }, random)
    let runeThisStage = null
    while (run.status !== 'defeated' && run.stage <= 500) {
      if (run.status === 'fighting') {
        run = resolveArcadeTurn(run, generateGrid(random), '2026-01-01T00:00:00.000Z')
        if (run.status !== 'fighting' && runeThisStage) {
          const entry = runeStages[runeThisStage] ||= { stages: 0, cleared: 0, damage: 0, spins: 0 }
          entry.stages += 1
          entry.cleared += Number(run.status === 'choosing-reward')
          entry.damage += run.battle.totalDamage
          entry.spins += run.battle.turn
        }
      } else if (run.status === 'choosing-reward') {
        for (const id of run.choices) offered[id] = (offered[id] || 0) + 1
        const id = choose(run, strategy, random)
        choices[id] = (choices[id] || 0) + 1
        run = applyUpgrade(run, id)
        runeThisStage = run.preparedRune
      } else if (run.status === 'transitioning') {
        run = startNextArcadeStage(run, random)
      } else throw new Error(`Unexpected status: ${run.status}`)
    }
    stages.push(run.maxStage)
    distribution[run.maxStage] = (distribution[run.maxStage] || 0) + 1
    spins += run.totalSpins
    bosses += run.defeatedBosses
    seconds += run.totalSpins * ARCADE_CONFIG.spinSeconds + run.defeatedBosses * ARCADE_CONFIG.choiceSeconds
    hpDefeats += Number(run.defeatReason === 'hp')
    spinDefeats += Number(run.defeatReason === 'spins')
    censored += Number(run.status !== 'defeated')
  }
  stages.sort((a, b) => a - b)
  const result = {
    meanStage: stages.reduce((sum, n) => sum + n, 0) / RUNS,
    medianStage: (stages[Math.floor((RUNS - 1) / 2)] + stages[Math.floor(RUNS / 2)]) / 2,
    maxStage: stages.at(-1),
    meanSpins: spins / RUNS,
    meanBosses: bosses / RUNS,
    estimatedMeanSeconds: seconds / RUNS,
    hpDefeatRate: hpDefeats / RUNS,
    spinsDefeatRate: spinDefeats / RUNS,
    censored,
    distribution,
    rewards: Object.fromEntries(REWARDS.map((entry) => [entry.id, { offered: offered[entry.id] || 0, selected: choices[entry.id] || 0, selectionRateWhenOffered: offered[entry.id] ? (choices[entry.id] || 0) / offered[entry.id] : 0 }])),
    runes: Object.fromEntries(Object.entries(runeStages).map(([id, entry]) => [id, { ...entry, clearRate: entry.cleared / entry.stages, meanDamage: entry.damage / entry.stages, meanSpins: entry.spins / entry.stages }])),
    simulationSeconds: (performance.now() - started) / 1000,
  }
  report.strategies[strategy] = result
  process.stdout.write(`${strategy}: mean stage ${result.meanStage.toFixed(2)}, median ${result.medianStage}, max ${result.maxStage}, HP defeats ${(result.hpDefeatRate * 100).toFixed(1)}%, spins ${(result.spinsDefeatRate * 100).toFixed(1)}%\n`)
}
mkdirSync('reports', { recursive: true })
writeFileSync('reports/arcade-balance.json', `${JSON.stringify(report, null, 2)}\n`)
let markdown = `# Roshan Gauntlet balance simulation\n\nSeed: ${SEED}. ${RUNS.toLocaleString('en')} runs per strategy (${(RUNS * STRATEGIES.length).toLocaleString('en')} total).\n\n| Strategy | Mean stage | Median | Max | Mean bosses | Mean spins | Estimated duration | HP defeat | Spins defeat |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|\n`
for (const [strategy, entry] of Object.entries(report.strategies)) {
  markdown += `| ${strategy} | ${entry.meanStage.toFixed(2)} | ${entry.medianStage} | ${entry.maxStage} | ${entry.meanBosses.toFixed(2)} | ${entry.meanSpins.toFixed(1)} | ${entry.estimatedMeanSeconds.toFixed(0)} s | ${(entry.hpDefeatRate * 100).toFixed(1)}% | ${(entry.spinsDefeatRate * 100).toFixed(1)}% |\n`
  markdown += ''
}
markdown += '\nDuration is an estimate: 1.45 seconds per animated spin and 8 seconds per reward choice, not measured human play time. Rune outcomes are observational and depend on stage and selection strategy; they do not establish causal advantage. A 500-stage simulation guard is reported as censored, never counted as a defeat. The game itself has no stage limit.\n'
for (const [strategy, entry] of Object.entries(report.strategies)) {
  markdown += `\n## ${strategy}\n\nEnd-stage distribution: ${Object.entries(entry.distribution).map(([stage, count]) => `${stage}: ${count}`).join(', ')}. Censored: ${entry.censored}.\n\n| Reward | Offered | Selected | Selection when offered |\n|---|---:|---:|---:|\n`
  for (const [id, reward] of Object.entries(entry.rewards)) markdown += `| ${id} | ${reward.offered} | ${reward.selected} | ${(reward.selectionRateWhenOffered * 100).toFixed(1)}% |\n`
  markdown += '\n| Rune | Stages | Clear rate | Mean damage | Mean spins |\n|---|---:|---:|---:|---:|\n'
  for (const [id, rune] of Object.entries(entry.runes)) markdown += `| ${id} | ${rune.stages} | ${(rune.clearRate * 100).toFixed(1)}% | ${rune.meanDamage.toFixed(1)} | ${rune.meanSpins.toFixed(1)} |\n`
}
writeFileSync('reports/arcade-balance.md', markdown)

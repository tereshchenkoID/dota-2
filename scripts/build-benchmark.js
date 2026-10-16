import { mkdirSync, writeFileSync } from 'node:fs'

import { ARCADE_CONFIG } from '@/modules/Dota/arcade/arcade-config'
import { enterStage, resolveArcadeTurn } from '@/modules/Dota/arcade/arcade-engine'
import { getBonuses } from '@/modules/Dota/arcade/upgrades'
import { generateGrid } from '@/modules/Dota/engine/spin'

import { seededRandom } from '@/lib/random'

const RUNS = Math.max(1, Number(process.argv[2]) || 10000)
const SEED = Number(process.argv[3]) || 20261016
const BUILDS = {
  baseline: [],
  damage: ['blade-mastery', 'critical-power', 'arcane-knowledge', 'roshan-hunter'],
  defense: ['vitality', 'fortified-armor', 'battle-recovery', 'second-wind'],
  utility: ['extra-charges', 'artifact-mastery'],
  hybrid: ['blade-mastery', 'extra-charges', 'vitality', 'fortified-armor', 'arcane-knowledge', 'battle-recovery'],
}
const RESULTS = []
for (const stage of [10, 20, 30]) {
  const budget = stage - 1
  const baseline = []
  for (const [name, ids] of Object.entries(BUILDS)) {
    const upgrades = {}
    for (let point = 0; ids.length && point < budget; point++) {
      const id = ids[point % ids.length]
      upgrades[id] = (upgrades[id] || 0) + 1
    }
    let wins = 0, turns = 0, hpLosses = 0, spinsLosses = 0
    const deltas = []
    for (let index = 0; index < RUNS; index++) {
      const seed = (SEED + Math.imul(index, 7919) + Math.imul(stage, 104729)) >>> 0
      const random = seededRandom(seed ^ 13)
      const maxHp = ARCADE_CONFIG.playerHp + getBonuses(upgrades).maxHp
      let run = enterStage({ id: 'benchmark', stage, maxStage: stage, maxHp, upgrades, preparedRune: null, totalDamage: 0, totalSpins: 0, defeatedBosses: 0, seed, battle: { hp: maxHp } }, seededRandom(seed ^ 29))
      while (run.status === 'fighting') run = resolveArcadeTurn(run, generateGrid(random))
      const won = Number(run.status === 'choosing-reward')
      if (name === 'baseline') baseline.push(won)
      deltas.push(won - baseline[index])
      wins += won
      turns += run.battle.turn
      hpLosses += Number(run.defeatReason === 'hp')
      spinsLosses += Number(run.defeatReason === 'spins')
    }
    const delta = deltas.reduce((sum, value) => sum + value, 0) / RUNS
    const variance = deltas.reduce((sum, value) => sum + (value - delta) ** 2, 0) / Math.max(1, RUNS - 1)
    RESULTS.push({ stage, budget: ids.length ? budget : 0, name, upgrades, clearRate: wins / RUNS, pairedClearDelta: delta, confidence95: 1.96 * Math.sqrt(variance / RUNS), meanTurns: turns / RUNS, hpLossRate: hpLosses / RUNS, spinsLossRate: spinsLosses / RUNS })
    process.stdout.write(`${stage} ${name}: ${(wins / RUNS * 100).toFixed(2)}% cleared\n`)
  }
}
const NOTE = 'Controlled single-stage benchmark. Same combat/modifier seeds, full build-specific HP, no rune, equal permanent-level budget among builds. Baseline intentionally has zero upgrades. Recovery between earlier stages and reward availability are not modeled; this measures combat strength, not the chance of acquiring this exact build in a real run. All groups retain the real stage modifier. Differences are paired by run; 95% intervals describe Monte Carlo sampling only.'
mkdirSync('reports', { recursive: true })
writeFileSync('reports/build-benchmark.json', `${JSON.stringify({ runsPerBuildStage: RUNS, seed: SEED, note: NOTE, results: RESULTS }, null, 2)}\n`)
let report = `# Controlled build benchmark\n\n${NOTE}\n\n${RUNS} fights per build/stage. Seed ${SEED}.\n\n| Stage | Build | Budget | Clear | Gain vs no build ±95% | Turns | HP losses | Spin losses |\n|---|---|---:|---:|---:|---:|---:|---:|\n`
for (const row of RESULTS) report += `| ${row.stage} | ${row.name} | ${row.budget} | ${(row.clearRate * 100).toFixed(2)}% | ${(row.pairedClearDelta * 100).toFixed(2)} ± ${(row.confidence95 * 100).toFixed(2)} pp | ${row.meanTurns.toFixed(1)} | ${(row.hpLossRate * 100).toFixed(1)}% | ${(row.spinsLossRate * 100).toFixed(1)}% |\n`
report += '\nAllocations:\n\n'
for (const row of RESULTS.filter((entry) => entry.stage === 30)) report += `- ${row.name}: ${JSON.stringify(row.upgrades)}\n`
writeFileSync('reports/build-benchmark.md', report)

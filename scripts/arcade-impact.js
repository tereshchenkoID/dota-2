import { mkdirSync, writeFileSync } from 'node:fs'

import { REWARDS } from '@/modules/Dota/arcade/reward-generator'

import { simulate } from './arcade-simulation.js'

const RUNS = Math.max(1, Number(process.argv[2]) || 10000)
const SEED = Number(process.argv[3]) || 20261016
const FULL = simulate({ runs: RUNS, seed: SEED, strategies: ['adaptive'] }).strategies.adaptive
const RESULTS = []
for (const reward of REWARDS) {
  const without = simulate({ runs: RUNS, seed: SEED, strategies: ['adaptive'], disabledIds: [reward.id] }).strategies.adaptive
  const deltas = FULL.perRun.map((stage, index) => stage - without.perRun[index])
  const mean = deltas.reduce((a, b) => a + b, 0) / RUNS
  const variance = deltas.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, RUNS - 1)
  RESULTS.push({ id: reward.id, type: reward.type, meanStageWith: FULL.meanStage, meanStageWithout: without.meanStage, pairedDelta: mean, confidence95: 1.96 * Math.sqrt(variance / RUNS), reach10Delta: FULL.reach10 - without.reach10 })
}
const REPORT = { runsPerExperiment: RUNS, seed: SEED, strategy: 'adaptive', note: 'Removing an offer also changes replacement choices and the resulting policy path. This estimates policy-level contribution, not an isolated per-hit multiplier. Common combat streams are paired by run and stage. Confidence intervals describe Monte Carlo uncertainty within this model, not human play.', results: RESULTS }
mkdirSync('reports', { recursive: true })
writeFileSync('reports/arcade-impact.json', `${JSON.stringify(REPORT, null, 2)}\n`)
let markdown = `# Controlled reward ablations\n\n${RUNS} paired runs per experiment, seed ${SEED}. ${REPORT.note}\n\n| Disabled reward | With | Without | Paired stage delta ±95% | Stage 10 contribution |\n|---|---:|---:|---:|---:|\n`
for (const row of RESULTS) markdown += `| ${row.id} | ${row.meanStageWith.toFixed(3)} | ${row.meanStageWithout.toFixed(3)} | ${row.pairedDelta.toFixed(3)} ± ${row.confidence95.toFixed(3)} | ${(row.reach10Delta * 100).toFixed(2)} pp |\n`
writeFileSync('reports/arcade-impact.md', markdown)

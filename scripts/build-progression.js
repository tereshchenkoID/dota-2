import { mkdirSync, writeFileSync } from 'node:fs'

import { UPGRADES } from '@/modules/Dota/arcade/upgrades'

import { formatReport, simulate } from './arcade-simulation.js'

const RUNS = Math.max(1, Number(process.argv[2]) || 10000)
const SEED = Number(process.argv[3]) || 20261016
const REPORT = simulate({ runs: RUNS, seed: SEED, strategies: UPGRADES.map((entry) => `focus:${entry.id}`) })
REPORT.note = 'Each policy always takes its target upgrade when offered; otherwise it uses adaptive decisions. It sees only ordinary player information. This is a focused policy, not a mathematical optimal-player bound. Maximum-level metrics count any upgrade reaching 30, and per-ID counts identify which one. All ten upgrades at level 30 require at least 300 reward choices (stage 301 to enter the next fight), excluding rune choices.'
mkdirSync('reports', { recursive: true })
writeFileSync('reports/build-progression.json', `${JSON.stringify(REPORT, (key, value) => key === 'perRun' ? undefined : value, 2)}\n`)
writeFileSync('reports/build-progression.md', `${formatReport(REPORT)}\n${REPORT.note}\n`)

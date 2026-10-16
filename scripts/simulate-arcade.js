import { mkdirSync, writeFileSync } from 'node:fs'

import { formatReport, simulate } from './arcade-simulation.js'

const RUNS = Math.max(1, Number(process.argv[2]) || 10000)
const SEED = Number(process.argv[3]) || 20261016
const OUTPUT = process.argv[4] || 'arcade-balance'
const REPORT = simulate({ runs: RUNS, seed: SEED })
mkdirSync('reports', { recursive: true })
writeFileSync(`reports/${OUTPUT}.json`, `${JSON.stringify(REPORT, (key, value) => key === 'perRun' ? undefined : value, 2)}\n`)
writeFileSync(`reports/${OUTPUT}.md`, formatReport(REPORT))

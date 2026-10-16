import { RUNES } from './runes'
import { UPGRADES } from './upgrades'

export const RECORD_DEFAULTS = { measuredRuns: 0, stageTotal: 0, longestSeconds: 0, recent: [] }

export function getRunSeconds(run) {
  const start = Date.parse(run.startedAt)
  const end = Date.parse(run.endedAt || new Date().toISOString())
  return Number.isFinite(start) && Number.isFinite(end) ? Math.max(0, Math.floor((end - start) / 1000)) : 0
}

export function summarizeRun(run) {
  return {
    id: run.id,
    stage: run.maxStage,
    bosses: run.defeatedBosses,
    damage: run.totalDamage,
    spins: run.totalSpins,
    seconds: getRunSeconds(run),
    endedAt: run.endedAt,
    reason: run.defeatReason,
    upgrades: Object.fromEntries(UPGRADES.filter((entry) => run.upgrades[entry.id]).map((entry) => [entry.id, run.upgrades[entry.id]])),
    runes: Object.fromEntries(RUNES.filter((entry) => run.runeHistory?.[entry.id]).map((entry) => [entry.id, run.runeHistory[entry.id]])),
  }
}

export function recordFinishedRun(stats, run) {
  if (run.status !== 'defeated' || run.recorded || stats.recent?.some((entry) => entry.id === run.id)) return { stats, run: run.status === 'defeated' ? { ...run, recorded: true } : run }
  const summary = summarizeRun(run)
  return {
    run: { ...run, recorded: true },
    stats: {
      ...RECORD_DEFAULTS,
      ...stats,
      finished: stats.finished + 1,
      measuredRuns: (stats.measuredRuns || 0) + 1,
      stageTotal: (stats.stageTotal || 0) + run.maxStage,
      longestSeconds: Math.max(stats.longestSeconds || 0, summary.seconds),
      recent: [summary, ...(stats.recent || [])].slice(0, 10),
    },
  }
}

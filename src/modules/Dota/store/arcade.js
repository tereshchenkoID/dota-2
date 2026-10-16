import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  applyUpgrade,
  createArcadeRun,
  IDLE_RUN,
  INITIAL_ARCADE_STATS,
  migrateArcadeState,
  resolveArcadeTurn,
  startNextArcadeStage,
} from '@/modules/Dota/arcade/arcade-engine'
import { recordFinishedRun } from '@/modules/Dota/arcade/run-records'
import { generateGrid } from '@/modules/Dota/engine/spin'

import { SAFE_STORAGE } from '@/lib/storage'

export const ARCADE_STORAGE_KEY = 'dota-spins-arcade'

export const createArcadeStore = (storage = SAFE_STORAGE) => create(persist((set, get) => ({
  run: IDLE_RUN,
  stats: { ...INITIAL_ARCADE_STATS },
  pending: null,
  spinning: false,
  newRun: (random = Math.random) => {
    if (get().spinning) return false
    const stats = get().stats
    const run = createArcadeRun({ id: crypto.randomUUID(), seed: Math.floor(random() * 4294967296), record: stats.bestStage }, random)
    set({ run, stats: { ...stats, bestStage: Math.max(stats.bestStage, 1), runs: stats.runs + 1 }, pending: null, spinning: false })
    return true
  },
  beginSpin: (random) => {
    const state = get()
    if (state.spinning || state.pending || state.run.status !== 'fighting' || state.run.battle.spins <= 0) return false
    set({ pending: generateGrid(random), spinning: true })
    return true
  },
  finishSpin: () => {
    const state = get()
    if (!state.pending || state.run.status !== 'fighting') return
    let run = resolveArcadeTurn(state.run, state.pending)
    let stats = {
      ...state.stats,
      bestStage: Math.max(state.stats.bestStage, run.maxStage),
      bosses: state.stats.bosses + run.defeatedBosses - state.run.defeatedBosses,
      damage: state.stats.damage + run.totalDamage - state.run.totalDamage,
      spins: state.stats.spins + 1,
    }
    if (run.status === 'defeated') ({ run, stats } = recordFinishedRun(stats, run))
    set({ run, stats, pending: null, spinning: false })
  },
  chooseReward: (id) => {
    const before = get().run
    const run = applyUpgrade(before, id)
    if (run === before) return false
    set({ run })
    return true
  },
  nextStage: (random = Math.random) => {
    const before = get().run
    const run = startNextArcadeStage(before, random)
    if (run === before) return false
    set({ run, stats: { ...get().stats, bestStage: Math.max(get().stats.bestStage, run.maxStage) } })
    return true
  },
  reset: () => {
    if (!get().spinning) set({ run: IDLE_RUN, stats: { ...INITIAL_ARCADE_STATS }, pending: null, spinning: false })
  },
}), {
  name: ARCADE_STORAGE_KEY,
  version: 2,
  storage: createJSONStorage(() => storage),
  skipHydration: true,
  partialize: ({ run, stats, pending }) => ({ run, stats, pending }),
  migrate: migrateArcadeState,
  merge: (persisted, current) => ({ ...current, ...migrateArcadeState(persisted, 2), spinning: false }),
  onRehydrateStorage: () => (state) => { if (state?.pending) state.finishSpin() },
}))

export const useArcadeStore = createArcadeStore()

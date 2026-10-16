import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { createRun, resolveTurn } from '@/modules/Dota/engine/battle'
import { applyRewards } from '@/modules/Dota/engine/rewards'
import { generateGrid } from '@/modules/Dota/engine/spin'

import { SAFE_STORAGE, STORAGE_KEY } from '@/lib/storage'

export const INITIAL_PROGRESS = {
  level: 1,
  xp: 0,
  gold: 0,
  wins: 0,
  losses: 0,
  best: 0,
  totalSpins: 0,
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      progress: { ...INITIAL_PROGRESS },
      run: createRun(),
      settings: { sound: false },
      pending: null,
      spinning: false,
      toggleSound: () => set((s) => ({ settings: { ...s.settings, sound: !s.settings.sound } })),

      beginSpin: (random) => {
        const s = get()
        if (s.spinning || s.run.status !== 'active' || s.run.spins <= 0)
          return false
        set({ pending: generateGrid(random), spinning: true })
        return true
      },

      finishSpin: () => {
        const s = get()
        if (!s.pending) return
        let run = resolveTurn(s.run, s.pending)
        let progress = { ...s.progress, totalSpins: s.progress.totalSpins + 1 }
        if (run.status !== 'active' && !run.rewarded) {
          progress = applyRewards(progress, run)
          run = { ...run, rewarded: true, endedAt: new Date().toISOString() }
        }
        set({ run, progress, pending: null, spinning: false })
      },

      newRun: () => {
        if (!get().spinning) set({ run: createRun(), pending: null, spinning: false })
      },

      reset: () =>
        set({
          progress: { ...INITIAL_PROGRESS },
          run: createRun(),
          pending: null,
          spinning: false,
        }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => SAFE_STORAGE),
      skipHydration: true,

      partialize: (s) => ({
        progress: s.progress,
        run: s.run,
        settings: { sound: s.settings.sound },
        pending: s.pending,
      }),

      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        settings: {
          sound:
            typeof persisted?.settings?.sound === 'boolean'
              ? persisted.settings.sound
              : current.settings.sound,
        },
      }),

      onRehydrateStorage: () => (state) => {
        if (state?.pending) state.finishSpin()
      },
    },
  ),
)

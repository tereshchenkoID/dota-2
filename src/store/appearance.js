import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { SAFE_STORAGE } from '@/lib/storage'
import { normalizeTheme, THEME_STORAGE_KEY } from '@/lib/theme'

export const useAppearanceStore = create(persist((set) => ({
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: (theme) => set({ theme: normalizeTheme(theme) }),
}), {
  name: THEME_STORAGE_KEY,
  version: 1,
  storage: createJSONStorage(() => SAFE_STORAGE),
  skipHydration: true,
  partialize: ({ theme }) => ({ theme }),
  merge: (persisted, current) => ({ ...current, theme: normalizeTheme(persisted?.theme) }),
}))

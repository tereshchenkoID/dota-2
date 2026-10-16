import { create } from 'zustand'

import { MODAL_REGISTRY } from '@/widgets/Modals/registry'

export const useModalStore = create((set, get) => ({
  modals: [],
  active: null,
  portalTarget: null,
  shownResult: null,

  openModal: (name, props = {}, options = {}) => {
    if (!MODAL_REGISTRY[name]) return
    const existing = get().modals.find((entry) => entry.name === name)
    if (existing) return existing.id
    const id = crypto.randomUUID?.() ?? `modal-${Date.now()}-${Math.random()}`
    set((state) => ({
      modals: [...state.modals, { id, name, props, options }],
      active: name,
    }))
    return id
  },

  closeModal: () =>
    set((state) => {
      const modals = state.modals.slice(0, -1)
      return { modals, active: modals.at(-1)?.name ?? null }
    }),

  closeAllModals: () => set({ modals: [], active: null }),

  setPortalTarget: (portalTarget) => set({ portalTarget }),

  showResult: (run) => {
    if (
      run.status === 'active' ||
      !run.endedAt ||
      get().shownResult === run.endedAt
    )
      return
    set({ shownResult: run.endedAt })
    get().openModal('result', { run })
  },
}))

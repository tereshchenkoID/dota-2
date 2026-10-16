'use client'

import { useEffect } from 'react'

import { useAppearanceStore } from '@/store/appearance'

import { resolveTheme } from '@/lib/theme'

const ThemeSync = () => {
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: light)')
    const apply = () => {
      const state = useAppearanceStore.getState()
      const theme = resolveTheme(state.theme, media.matches)
      document.documentElement.dataset.theme = theme
      if (state.resolvedTheme !== theme) useAppearanceStore.setState({ resolvedTheme: theme })
    }

    let mounted = true
    const unsubscribe = useAppearanceStore.subscribe((state, previous) => {
      if (state.theme !== previous.theme) apply()
    })

    Promise.resolve(useAppearanceStore.persist.rehydrate()).then(() => { if (mounted) apply() })
    media.addEventListener('change', apply)

    return () => {
      mounted = false
      unsubscribe()
      media.removeEventListener('change', apply)
    }
  }, [])

  return null
}

export default ThemeSync

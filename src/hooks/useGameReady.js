'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

import { useProfileStore } from '@/store/profile'
import { useArcadeStore } from '@/modules/Dota/store/arcade'
import { useGameStore } from '@/modules/Dota/store/game'

import { SYMBOLS } from '@/modules/Dota/engine/spin'

const GAME_ASSETS = [...new Set([
  ...SYMBOLS.map((symbol) => symbol.image),
  '/assets/bosses/roshan.jpg',
  '/assets/ui/dota-background.jpg',
  '/assets/ui/dota-logo.png',
])]
const STORES = [useGameStore, useProfileStore, useArcadeStore]

const subscribe = (notify) => {
  const unsubscribe = STORES.flatMap((store) => [
    store.persist.onHydrate(notify),
    store.persist.onFinishHydration(notify),
  ])
  return () => unsubscribe.forEach((stop) => stop())
}

const getSnapshot = () => STORES.every((store) => store.persist.hasHydrated())
const getServerSnapshot = () => false

export const useGameReady = () => {
  const hydrated = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [attempt, setAttempt] = useState(0)
  const [assets, setAssets] = useState({ loaded: 0, failed: 0, done: false })

  useEffect(() => {
    let cancelled = false
    let loaded = 0
    let failed = 0
    const images = []
    setAssets({ loaded, failed, done: false })

    const preload = (src) => new Promise((resolve) => {
      const image = new window.Image()
      images.push(image)
      const finish = (success) => {
        image.onload = null
        image.onerror = null
        if (!success) failed += 1
        loaded += 1
        if (!cancelled) setAssets({ loaded, failed, done: false })
        resolve()
      }
      image.onload = () => {
        image.decode().then(() => finish(true), () => finish(false))
      }
      image.onerror = () => finish(false)
      image.src = src
    })

    const fonts = document.fonts
      ? Promise.all(['--font-inter', '--font-game', '--font-game-display'].map((property) => {
        const family = getComputedStyle(document.documentElement).getPropertyValue(property).trim()
        return family ? document.fonts.load(`400 16px ${family}`) : Promise.resolve()
      })).catch(() => { failed += 1 })
      : Promise.resolve()

    Promise.all([...GAME_ASSETS.map(preload), fonts]).then(() => {
      if (!cancelled) setAssets({ loaded, failed, done: true })
    })

    return () => {
      cancelled = true
      images.forEach((image) => {
        image.onload = null
        image.onerror = null
      })
    }
  }, [attempt])

  return {
    ready: hydrated && assets.done && assets.failed === 0,
    progress: Math.round((assets.loaded + Number(hydrated) + Number(assets.done)) / (GAME_ASSETS.length + 2) * 100),
    error: assets.done && assets.failed > 0,
    retry: () => setAttempt((value) => value + 1),
  }
}

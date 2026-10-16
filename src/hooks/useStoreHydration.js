'use client'

import { useEffect } from 'react'

import { useProfileStore } from '@/store/profile'
import { useArcadeStore } from '@/modules/Dota/store/arcade'
import { useGameStore } from '@/modules/Dota/store/game'

const STORES = [useGameStore, useProfileStore, useArcadeStore]

export const useStoreHydration = () => {
  useEffect(() => {
    STORES.forEach((store) => {
      if (!store.persist.hasHydrated()) store.persist.rehydrate()
    })
  }, [])
}

'use client'

import { useEffect } from 'react'

import { useProfileStore } from '@/store/profile'
import { useGameStore } from '@/modules/Dota/store/game'

const STORES = [useGameStore, useProfileStore]

export const useStoreHydration = () => {
  useEffect(() => {
    STORES.forEach((store) => {
      if (!store.persist.hasHydrated()) store.persist.rehydrate()
    })
  }, [])
}

'use client'
import { useGameStore } from '@/modules/Dota/store/game'

import { stopSounds, unlockAudio } from '@/lib/sound'
export const useSound = () => {
  const enabled = useGameStore((state) => state.settings.sound)
  const toggleSound = useGameStore((state) => state.toggleSound)
  const setEnabled = (next) => {
    if (next === useGameStore.getState().settings.sound) return
    if (next) unlockAudio()
    else stopSounds()
    toggleSound()
  }
  return { enabled, setEnabled, toggle: () => setEnabled(!enabled) }
}

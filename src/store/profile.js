import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import avatars from '@/modules/Dota/config/avatars.json'

import { SAFE_STORAGE } from '@/lib/storage'

export const useProfileStore = create(
  persist(
    (set) => ({
      username: 'Player',
      avatar: 'juggernaut',
      setUsername: (username) => set({ username: username.slice(0, 24) }),
      setAvatar: (avatar) => {
        if (avatars.some((hero) => hero.id === avatar)) set({ avatar })
      },
    }),
    {
      name: 'spin-arcade-profile-v1',
      storage: createJSONStorage(() => SAFE_STORAGE),
      skipHydration: true,
    },
  ),
)

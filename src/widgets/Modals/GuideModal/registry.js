import { lazy } from 'react'

import { stripLanguage } from '@/i18n/navigation'

const ARCADE_GUIDE = {
  Component: lazy(() => import('./index')),
  title: 'arcadeGuide.title',
}

// Each playable route owns its guide; catalog and unknown routes use arcade help.
const GAME_GUIDES = {
  '/dota': {
    Component: lazy(() => import('@/modules/Dota/components/GameGuide')),
    title: 'guide.dotaTitle',
  },
}

export function resolveGuide(pathname) {
  const route = stripLanguage(pathname).replace(/\/+$/, '') || '/'
  return GAME_GUIDES[route] || ARCADE_GUIDE
}

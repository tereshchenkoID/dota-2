import { lazy } from 'react'

import { resolveGuide } from './GuideModal/registry'

export const MODAL_REGISTRY = {
  'arcade-build': { Component: lazy(() => import('./ArcadeBuild')), title: 'progression.currentBuild' },
  'arcade-records': { Component: lazy(() => import('./ArcadeRecords')), title: 'progression.arcadeRecords' },
  'arcade-reward': {
    Component: lazy(() => import('./ArcadeReward')),
    title: 'gauntlet.cleared',
  },
  'arcade-result': {
    Component: lazy(() => import('./ArcadeResult')),
    title: 'progression.runComplete',
  },
  'arcade-restart': {
    Component: lazy(() => import('./ConfirmModal')),
    title: 'gauntlet.restartTitle',
    props: { action: 'arcade-restart' },
  },
  profile: {
    Component: lazy(() => import('./ProfileModal')),
    title: 'profile.title',
    variant: 'drawer',
  },
  avatar: {
    Component: lazy(() => import('./AvatarModal')),
    title: 'profile.avatarTitle',
  },
  settings: {
    Component: lazy(() => import('./SettingsModal')),
    title: 'settings.title',
  },
  stats: {
    Component: lazy(() => import('./StatsModal')),
    title: 'stats.title',
  },
  guide: { resolve: resolveGuide },
  result: {
    Component: lazy(() => import('./ResultModal')),
    title: ({ run }) => `result.${run.status}Title`,
  },
  restart: {
    Component: lazy(() => import('./ConfirmModal')),
    title: 'game.restartTitle',
    props: { action: 'restart' },
  },
  reset: {
    Component: lazy(() => import('./ConfirmModal')),
    title: 'settings.resetTitle',
    props: { action: 'reset' },
  },
}

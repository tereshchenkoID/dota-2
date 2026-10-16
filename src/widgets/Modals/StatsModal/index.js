'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { useGameStore } from '@/modules/Dota/store/game'

import Metrics from '@/modules/Metrics'

const StatsModal = () => {
  const { t, number } = useTranslation()
  const progress = useGameStore((state) => state.progress)
  const metrics = [['wins', progress.wins], ['losses', progress.losses], ['best', progress.best], ['spins', progress.totalSpins]]

  return (
    <Metrics items={metrics.map(([id, value]) => ({ id, label: t(`stats.${id}`), value: number(value) }))} />
  )
}

export default StatsModal

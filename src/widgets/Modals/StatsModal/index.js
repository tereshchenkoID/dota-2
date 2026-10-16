'use client'

import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'
import { useGameStore } from '@/modules/Dota/store/game'

import Heading from '@/components/Heading'
import Text from '@/components/Text'

import styles from './index.module.scss'
const StatsModal = () => {
  const { t, number } = useTranslation()
  const progress = useGameStore((s) => s.progress)
  return (
    <div className={clsx(styles.grid, styles.group)}>
      {
        ['wins', 'losses', 'best', 'spins'].map((key, i) => (
          <div
            className={styles.group}
            key={key}
          >
            <Text
              size={3}
              color="muted"
            >
              {t('stats.' + key)}
            </Text>
            <Heading
              className={styles.value}
              as="strong"
              size={2}
            >
              {
                number(
                  [
                    progress.wins,
                    progress.losses,
                    progress.best,
                    progress.totalSpins,
                  ][i],
                )
              }
            </Heading>
          </div>
        ))
      }
    </div>
  )
}

export default StatsModal

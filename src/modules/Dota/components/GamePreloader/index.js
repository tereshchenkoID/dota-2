'use client'

import { useGameReady } from '@/hooks/useGameReady'
import { useTranslation } from '@/hooks/useTranslation'

import Button from '@/components/Button'
import Icon from '@/components/Icon'
import Text from '@/components/Text'

import styles from './index.module.scss'

const GamePreloader = ({ children }) => {
  const { ready, progress, error, retry } = useGameReady()
  const { t, number } = useTranslation()

  if (ready) return children

  return (
    <section
      className={styles.loader}
      aria-busy={!error}
      aria-label={t('game.loading')}
    >
      <Icon
        className={styles.icon}
        name={error ? 'circle-alert' : 'swords'}
        size={48}
      />
      <strong className={styles.title}>
        {t('app.title')}
      </strong>
      <Text role="status">
        {t(error ? 'game.loadingError' : 'game.loading')}
      </Text>
      {
        !error &&
        <>
          <div
            className={styles.track}
            role="progressbar"
            aria-label={t('game.loading')}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span
              className={styles.fill}
              style={{ '--progress': `${progress}%` }}
            />
          </div>
          <Text
            size={3}
            color="muted"
          >
            {t('game.loadingHint')}
            {' '}
            {number(progress)}
            %
          </Text>
        </>
      }
      {
        error &&
        <Button onClick={retry}>
          {t('game.retry')}
        </Button>
      }
    </section>
  )
}

export default GamePreloader

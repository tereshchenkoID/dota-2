'use client'

import { useGameReady } from '@/hooks/useGameReady'
import { useTranslation } from '@/hooks/useTranslation'

import Button from '@/components/Button'
import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Panel from '@/components/Panel'
import Progress from '@/components/Progress'
import Text from '@/components/Text'

import styles from './index.module.scss'

const GamePreloader = ({ children }) => {
  const { t, number } = useTranslation()
  const { ready, progress, error, retry } = useGameReady()

  if (ready) return children

  return (
    <Panel
      variant="raised"
      className={styles.block}
      aria-busy={!error}
      aria-label={t('game.loading')}
    >
      <Icon
        className={styles.icon}
        name={error ? 'circle-alert' : 'swords'}
        size={48}
      />
      <Heading
        as="strong"
        size={3}
      >
        {t('app.title')}
      </Heading>
      <Text role="status">
        {t(error ? 'game.loadingError' : 'game.loading')}
      </Text>
      {
        !error &&
        <>
          <Progress
            className={styles.track}
            value={progress}
            label={t('game.loading')}
          />
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
    </Panel>
  )
}

export default GamePreloader

'use client'

import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'

import Button from '@/components/Button'
import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Link from '@/components/Link'
import Text from '@/components/Text'
import BattleLog from '@/modules/Dota/components/BattleLog'
import DotaGame from '@/modules/Dota/components/DotaGame'
import GameGuide from '@/modules/Dota/components/GameGuide'
import GamePreloader from '@/modules/Dota/components/GamePreloader'

import styles from './index.module.scss'
const DotaView = () => {
  const { t } = useTranslation()
  const open = useModalStore((s) => s.openModal)
  return (
    <div className={clsx(styles.page, styles.group)}>
      <div className={clsx(styles.intro, styles.group)}>
        <div className={styles.group}>
          <Link
            className={styles.link}
            href="/"
          >
            <Icon
              name="arrow-left"
              size={18}
            />
            {' '}
            {t('nav.games')}
          </Link>
          <Heading
            as="h1"
            size={2}
          >
            {t('app.title')}
          </Heading>
          <Text color="muted">
            {t('game.subtitle')}
          </Text>
        </div>
        <Button
          className={styles.control}
          color="secondary"
          onClick={() => open('guide')}
        >
          {t('nav.guide')}
        </Button>
      </div>
      <GamePreloader>
        <DotaGame />
        <div className={clsx(styles.details, styles.group)}>
          <GameGuide compact />
          <BattleLog />
        </div>
        <Text
          size={3}
          color="muted"
          className={styles.note}
        >
          {t('game.free')}
        </Text>
      </GamePreloader>
    </div>
  )
}

export default DotaView

'use client'

import clsx from 'clsx'

import { usePathname } from '@/i18n/navigation'

import { useTranslation } from '@/hooks/useTranslation'
import { useArcadeStore } from '@/modules/Dota/store/arcade'

import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Link from '@/components/Link'
import Text from '@/components/Text'

import styles from './index.module.scss'

const ModeMenu = () => {
  const { t, number } = useTranslation()
  const pathname = usePathname().replace(/\/+$/, '')
  const { run, stats } = useArcadeStore()
  const continuing = ['fighting', 'choosing-reward', 'transitioning'].includes(run.status)

  return (
    <nav
      className={styles.block}
      aria-label={t('gauntlet.chooseMode')}
    >
      <Link
        className={clsx(styles.card, pathname === '/dota' && styles.active)}
        href="/dota/"
      >
        <Icon
          name="swords"
          size={24}
        />
        <Heading
          as="h3"
          size={4}
        >
          {t('gauntlet.classic')}
        </Heading>
        <Text
          size={3}
          color="muted"
        >
          {t('gauntlet.classicDescription')}
        </Text>
      </Link>
      <Link
        className={clsx(styles.card, styles.arcade, pathname.includes('/arcade') && styles.active)}
        href="/dota/arcade/"
      >
        <Icon
          name="trophy"
          size={24}
        />
        <Heading
          as="h3"
          size={4}
        >
          {t('gauntlet.mode')}
        </Heading>
        <Text
          size={3}
          color="muted"
        >
          {t('gauntlet.description')}
        </Text>
        <Text
          as="span"
          size={3}
          color="accent"
        >
          {t('gauntlet.best', { stage: number(stats.bestStage) })}
          {' · '}
          {t(continuing ? 'gauntlet.continue' : 'gauntlet.start')}
        </Text>
      </Link>
    </nav>
  )
}

export default ModeMenu

'use client'

import clsx from 'clsx'

import { usePathname } from '@/i18n/navigation'

import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'
import { useGameStore } from '@/modules/Dota/store/game'

import Button from '@/components/Button'
import Icon from '@/components/Icon'
import Link from '@/components/Link'
import Logo from '@/components/Logo'
import Languages from '@/modules/Languages'

import styles from './index.module.scss'

const Section = () => {
  const { t, number } = useTranslation()

  const onOpen = useModalStore((s) => s.openModal)
  const active = useModalStore((s) => s.active)
  const progress = useGameStore((s) => s.progress)
  const pathname = usePathname()

  return (
    <header className={styles.block}>
      <div className={styles.inner}>
        <Logo />
        <nav className={styles.nav}>
          <Link
            href="/#games"
            className={
              clsx(
                styles.link,
                {
                  [styles.active]: pathname === '/',
                }
              )
            }
          >
            {t('nav.games')}
          </Link>
          <button
            className={styles.control}
            type="button"
            onClick={() => onOpen('guide')}
          >
            {t('nav.guide')}
          </button>
          <button
            className={styles.control}
            type="button"
            onClick={() => onOpen('stats')}
          >
            {t('nav.stats')}
          </button>
        </nav>
        <div className={styles.account}>
          <button
            type="button"
            className={clsx(styles.level, styles.control)}
            onClick={() => onOpen('profile')}
            aria-label={t('profile.levelDetails')}
          >
            <span className={styles.badge}>
              {number(progress.level)}
            </span>
            <span className={styles.details}>
              <b>
                {t('header.level', { level: number(progress.level) })}
              </b>
              <span className={styles.track}>
                <i
                  className={styles.fill}
                  style={
                    {
                      '--progress': `${((progress.xp % 250) / 250) * 100}%`,
                    }
                  }
                />
              </span>
            </span>
          </button>
          <span
            className={styles.gold}
            title={t('header.gold')}
          >
            <Icon
              name="coins"
              size={19}
            />
            <b>
              {number(progress.gold)}
            </b>
          </span>
          <div className={styles.language}>
            <Languages />
          </div>
          <Button
            color="alt"
            square={true}
            aria-label={t('ui.menu')}
            aria-haspopup="dialog"
            aria-expanded={active === 'profile'}
            onClick={() => onOpen('profile')}
          >
            <Icon
              name="menu"
              size={22}
            />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Section

'use client'

import { usePathname } from '@/i18n/navigation'

import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'
import { useGameStore } from '@/modules/Dota/store/game'

import Button from '@/components/Button'
import Container from '@/components/Container'
import Icon from '@/components/Icon'
import Link from '@/components/Link'
import Logo from '@/components/Logo'
import Text from '@/components/Text'
import Languages from '@/modules/Languages'

import styles from './index.module.scss'

const HeaderView = () => {
  const { t, number } = useTranslation()
  const { openModal, active } = useModalStore()
  const progress = useGameStore((state) => state.progress)
  const pathname = usePathname()

  return (
    <header className={styles.block}>
      <Container className={styles.container}>
        <Logo />
        <nav className={styles.nav}>
          <Button
            as={Link}
            href="/#games"
            color="ghost"
            selected={pathname === '/'}
          >
            {t('nav.games')}
          </Button>
          <Button
            color="ghost"
            onClick={() => openModal('guide')}
          >
            {t('nav.guide')}
          </Button>
          <Button
            color="ghost"
            onClick={() => openModal('stats')}
          >
            {t('nav.stats')}
          </Button>
        </nav>
        <div className={styles.account}>
          <Button
            color="secondary"
            square
            onClick={() => openModal('profile')}
            aria-label={t('profile.levelDetails')}
          >
            {number(progress.level)}
          </Button>
          <Text
            as="span"
            size={3}
            color="accent"
            className={styles.gold}
          >
            <Icon
              name="coins"
              size={20}
            />
            {number(progress.gold)}
          </Text>
          <div className={styles.language}>
            <Languages />
          </div>
          <Button
            color="secondary"
            square
            aria-label={t('ui.menu')}
            aria-haspopup="dialog"
            aria-expanded={active === 'profile'}
            onClick={() => openModal('profile')}
          >
            <Icon
              name="menu"
              size={20}
            />
          </Button>
        </div>
      </Container>
    </header>
  )
}

export default HeaderView

'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'
import { useArcadeStore } from '@/modules/Dota/store/arcade'

import Button from '@/components/Button'
import Container from '@/components/Container'
import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Link from '@/components/Link'
import Text from '@/components/Text'
import ArcadeGame from '@/modules/Dota/components/arcade-game'
import BattleLog from '@/modules/Dota/components/BattleLog'
import DotaGame from '@/modules/Dota/components/DotaGame'
import GameGuide from '@/modules/Dota/components/GameGuide'
import GamePreloader from '@/modules/Dota/components/GamePreloader'
import ModeMenu from '@/modules/Dota/components/mode-menu'

import styles from './index.module.scss'

const Section = ({ mode = 'classic' }) => {
  const { t } = useTranslation()
  const open = useModalStore((s) => s.openModal)
  const arcadeRun = useArcadeStore((s) => s.run)
  const arcade = mode === 'arcade'

  return (
    <Container>
      <section className={styles.intro}>
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
            {t(arcade ? 'gauntlet.title' : 'app.title')}
          </Heading>
          <Text color="muted">
            {t('game.subtitle')}
          </Text>
        </div>
        <Button
          color="secondary"
          onClick={() => open('guide')}
        >
          {t('nav.guide')}
        </Button>
      </section>
      <ModeMenu />
      <GamePreloader>
        {
          arcade
            ? <ArcadeGame />
            : <DotaGame />
        }
        <section className={styles.details}>
          <GameGuide compact />
          <BattleLog battle={arcade ? (arcadeRun.battle || { log: [] }) : undefined} />
        </section>
        <Text
          size={3}
          color="muted"
          className={styles.note}
        >
          {t('game.free')}
        </Text>
      </GamePreloader>
    </Container>
  )
}

export default Section

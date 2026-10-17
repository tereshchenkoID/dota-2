'use client'

import Image from 'next/image'

import { UPCOMING_GAMES } from '@/constant/games'

import { useTranslation } from '@/hooks/useTranslation'
import { useGameStore } from '@/modules/Dota/store/game'

import Badge from '@/components/Badge'
import Button from '@/components/Button'
import Container from '@/components/Container'
import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Link from '@/components/Link'
import Panel from '@/components/Panel'
import Text from '@/components/Text'
import ModeMenu from '@/modules/Dota/components/ModeMenu'
import Upcoming from '@/modules/Upcoming'

import styles from './index.module.scss'

const PRINCIPLES = ['local', 'fair', 'worlds']

const Section = () => {
  const { t } = useTranslation()
  const run = useGameStore((s) => s.run)

  return (
    <Container className={styles.block}>
      <section className={styles.intro}>
        <Text
          size={3}
          color="accent"
        >
          {t('home.eyebrow')}
        </Text>
        <Heading
          as="h1"
          size={1}
        >
          {t('site.title')}
        </Heading>
        <Text
          size={1}
          color="muted"
        >
          {t('home.subtitle')}
        </Text>
      </section>
      <section id="games">
        <div className={styles.headline}>
          <Heading>
            {t('home.games')}
          </Heading>
          <Text
            size={3}
            color="muted"
          >
            {t('home.free')}
          </Text>
        </div>
        <Panel
          as={Link}
          interactive
          padding={0}
          href="/dota/"
          className={styles.card}
          aria-label={t('home.openDota')}
        >
          <div className={styles.art}>
            <Image
              className={styles.image}
              width={800}
              height={921}
              src="/assets/bosses/roshan.jpg"
              alt={t('game.roshan')}
            />
            <Badge
              color="dark"
              className={styles.badge}
            >
              {t('home.genre')}
            </Badge>
          </div>
          <div className={styles.content}>
            <Image
              width={634}
              height={591}
              className={styles.logo}
              src="/assets/ui/dota-logo.png"
              alt=""
            />
            <Heading
              as="h3"
              size={2}
            >
              {t('app.title')}
            </Heading>
            <Text color="muted">
              {t('home.description')}
            </Text>
            <div className={styles.meta}>
              <Badge>
                {t('home.heroes')}
              </Badge>
              <Badge>
                {t('home.artifacts')}
              </Badge>
              <Badge>
                {t('home.boss')}
              </Badge>
            </div>
            <Button
              as="span"
              full
            >
              {
                t(
                  run.status === 'active' && run.turn > 0
                    ? 'home.continue'
                    : 'home.play',
                )
              }
              {' '}
              <span>
                <Icon
                  name="arrow-up-right"
                  size={24}
                />
              </span>
            </Button>
          </div>
        </Panel>
        <ModeMenu />
        <div className={styles.upcoming}>
          {
            UPCOMING_GAMES.map((game) =>
              <Upcoming
                key={game.id}
                {...game}
              />
            )
          }
        </div>
      </section>
      <section className={styles.principles}>
        {
          PRINCIPLES.map((key) =>
            <div
              className={styles.principle}
              key={key}
            >
              <Heading
                as="h3"
                size={3}
              >
                {t('home.' + key + 'Title')}
              </Heading>
              <Text color="muted">
                {t('home.' + key + 'Body')}
              </Text>
            </div>
          )
        }
      </section>
    </Container>
  )
}

export default Section

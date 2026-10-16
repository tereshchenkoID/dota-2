'use client'

import Image from 'next/image'
import clsx from 'clsx'

import { UPCOMING_GAMES } from '@/constant/games'

import { useTranslation } from '@/hooks/useTranslation'
import { useGameStore } from '@/modules/Dota/store/game'

import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Link from '@/components/Link'
import Text from '@/components/Text'
import ModeMenu from '@/modules/Dota/components/mode-menu'
import UpcomingCard from '@/modules/Upcoming'

import styles from './index.module.scss'

const PRINCIPLES = ['local', 'fair', 'worlds']

const Section = () => {
  const { t } = useTranslation()
  const run = useGameStore((s) => s.run)

  return (
    <div className={clsx(styles.page, styles.group)}>
      <section className={styles.intro}>
        <Text
          className={styles.description}
          size={3}
          color="accent"
        >
          {t('home.eyebrow')}
        </Text>
        <Heading
          className={styles.title}
          as="h1"
          size={1}
        >
          {t('site.title')}
        </Heading>
        <Text
          className={styles.description}
          size={1}
          color="muted"
        >
          {t('home.subtitle')}
        </Text>
      </section>
      <section
        id="games"
        className={styles.games}
      >
        <div className={clsx(styles.sectionHeading, styles.group)}>
          <Heading>
            {t('home.games')}
          </Heading>
          <Text
            className={styles.description}
            size={3}
            color="muted"
          >
            {t('home.free')}
          </Text>
        </div>
        <Link
          href="/dota/"
          className={styles.gameCard}
          aria-label={t('home.openDota')}
        >
          <div className={clsx(styles.art, styles.group)}>
            <Image
              className={styles.image}
              width={800}
              height={921}
              src="/assets/bosses/roshan.jpg"
              alt={t('game.roshan')}
            />
            <Text
              as="span"
              size={3}
              color="white"
              className={clsx(styles.badge, styles.label)}
            >
              {t('home.genre')}
            </Text>
          </div>
          <div className={clsx(styles.cardContent, styles.group)}>
            <Image
              width={634}
              height={591}
              className={clsx(styles.dotaMark, styles.image)}
              src="/assets/ui/dota-logo.png"
              alt=""
            />
            <Heading
              as="h3"
              size={2}
            >
              {t('app.title')}
            </Heading>
            <Text
              className={styles.description}
              color="muted"
            >
              {t('home.description')}
            </Text>
            <div className={clsx(styles.meta, styles.group)}>
              <Text
                className={styles.label}
                as="span"
                size={3}
                color="muted"
              >
                {t('home.heroes')}
              </Text>
              <Text
                className={styles.label}
                as="span"
                size={3}
                color="muted"
              >
                {t('home.artifacts')}
              </Text>
              <Text
                className={styles.label}
                as="span"
                size={3}
                color="muted"
              >
                {t('home.boss')}
              </Text>
            </div>
            <span className={clsx(styles.play, styles.label)}>
              {
                t(
                  run.status === 'active' && run.turn > 0
                    ? 'home.continue'
                    : 'home.play',
                )
              }
              {' '}
              <span className={styles.label}>
                <Icon
                  name="arrow-up-right"
                  size={24}
                />
              </span>
            </span>
          </div>
        </Link>
        <ModeMenu />
        <div className={clsx(styles.upcoming, styles.group)}>
          {
            UPCOMING_GAMES.map((game) => (
              <UpcomingCard
                key={game.id}
                {...game}
              />
            ))
          }
        </div>
      </section>
      <div className={clsx(styles.principles, styles.group)}>
        {
          PRINCIPLES.map((key) => (
            <div
              className={styles.group}
              key={key}
            >
              <Heading
                as="h3"
                size={3}
              >
                {t('home.' + key + 'Title')}
              </Heading>
              <Text
                className={styles.description}
                color="muted"
              >
                {t('home.' + key + 'Body')}
              </Text>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Section

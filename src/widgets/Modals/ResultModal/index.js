'use client'

import Image from 'next/image'
import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'
import { useGameStore } from '@/modules/Dota/store/game'

import Button from '@/components/Button'
import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Text from '@/components/Text'
import { getRewards } from '@/modules/Dota/engine/rewards'

import styles from './index.module.scss'

const ResultModal = ({ run, onClose }) => {
  const { t, number, date } = useTranslation()
  const reward = getRewards(run)
  const won = run.status === 'won'
  const newRun = useGameStore((s) => s.newRun)
  const closeAll = useModalStore((s) => s.closeAllModals)
  const onAgain = () => {
    newRun()
    closeAll()
  }

  return (
    <div className={clsx(styles.result, styles.group)}>
      <div className={clsx(styles.banner, styles.group, won && styles.victory)}>
        {
          won &&
          <Image
            src="/assets/bosses/roshan.jpg"
            width={800}
            height={921}
            alt=""
            className={styles.art}
          />
        }
        <div className={clsx(styles.celebration, styles.group)}>
          <span className={styles.emblem}>
            <Icon
              name={won ? 'trophy' : 'swords'}
              size={40}
            />
          </span>
          <Text
            as="span"
            size={4}
            color="linkHover"
            weight="semibold"
            className={styles.eyebrow}
          >
            {t(`result.${run.status}`)}
          </Text>
          <Heading
            as="h3"
            size={1}
          >
            {t(won ? 'result.victory' : 'result.tryAgain')}
          </Heading>
          <Text className={styles.description}>
            {t(`result.${run.status}Body`)}
          </Text>
        </div>
      </div>

      <div className={clsx(styles.loot, styles.group)}>
        <Text
          className={styles.description}
          size={3}
          color="muted"
        >
          {t('result.reward')}
        </Text>
        <div className={clsx(styles.rewards, styles.group)}>
          <div className={styles.group}>
            <Icon
              name="sparkles"
              size={24}
            />
            <Heading
              className={styles.value}
              as="strong"
              size={3}
            >
              {t('result.xp', { amount: number(reward.xp) })}
            </Heading>
          </div>
          <div className={styles.group}>
            <Icon
              name="coins"
              size={24}
            />
            <Heading
              className={styles.value}
              as="strong"
              size={3}
            >
              {t('result.gold', { amount: number(reward.gold) })}
            </Heading>
          </div>
        </div>
        {
          won &&
          <Text
            className={styles.description}
            size={3}
            color="muted"
          >
            {t('result.saved')}
          </Text>
        }
      </div>

      <dl className={styles.stats}>
        <div className={styles.group}>
          <Text
            as="dt"
            size={4}
            color="muted"
          >
            {t('game.totalDamage')}
          </Text>
          <Heading
            className={styles.value}
            as="dd"
            size={4}
          >
            {number(run.totalDamage)}
          </Heading>
        </div>
        <div className={styles.group}>
          <Text
            as="dt"
            size={4}
            color="muted"
          >
            {t('result.turns')}
          </Text>
          <Heading
            className={styles.value}
            as="dd"
            size={4}
          >
            {number(run.turn)}
          </Heading>
        </div>
        <div className={styles.group}>
          <Text
            as="dt"
            size={4}
            color="muted"
          >
            {t('game.hp')}
          </Text>
          <Heading
            className={styles.value}
            as="dd"
            size={4}
          >
            {number(run.hp)}
            {' '}
            HP
          </Heading>
        </div>
      </dl>
      {
        run.endedAt &&
        <Text
          className={styles.description}
          size={3}
          color="muted"
        >
          {t('result.date', { date: date(run.endedAt) })}
        </Text>
      }
      <div className={clsx(styles.actions, styles.group)}>
        <Button onClick={onAgain}>
          {t('result.again')}
        </Button>
        <Button
          color="secondary"
          onClick={onClose}
        >
          {t('result.close')}
        </Button>
      </div>
    </div>
  )
}

export default ResultModal

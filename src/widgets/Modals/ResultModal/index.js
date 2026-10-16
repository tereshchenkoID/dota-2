'use client'

import Image from 'next/image'

import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'
import { useGameStore } from '@/modules/Dota/store/game'

import Badge from '@/components/Badge'
import Button from '@/components/Button'
import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Panel from '@/components/Panel'
import Text from '@/components/Text'
import { getRewards } from '@/modules/Dota/engine/rewards'
import Metrics from '@/modules/Metrics'

import styles from './index.module.scss'

const ResultModal = ({ run, onClose }) => {
  const { t, number, date } = useTranslation()
  const reward = getRewards(run)
  const won = run.status === 'won'
  const newRun = useGameStore((state) => state.newRun)
  const closeAll = useModalStore((state) => state.closeAllModals)
  const onAgain = () => { newRun(); closeAll() }

  return (
    <div className={styles.block}>
      <Panel
        variant="raised"
        padding={0}
        className={styles.banner}
      >
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
        <div className={styles.celebration}>
          <Icon
            name={won ? 'trophy' : 'swords'}
            size={48}
          />
          <Badge color={won ? 'success' : 'neutral'}>
            {t(`result.${run.status}`)}
          </Badge>
          <Heading
            as="h3"
            size={2}
          >
            {t(won ? 'result.victory' : 'result.tryAgain')}
          </Heading>
          <Text>
            {t(`result.${run.status}Body`)}
          </Text>
        </div>
      </Panel>
      <Text
        size={3}
        color="muted"
      >
        {t('result.reward')}
      </Text>
      <Metrics items={
        [
          { id: 'xp', label: t('header.experience'), value: t('result.xp', { amount: number(reward.xp) }), icon: 'sparkles' },
          { id: 'gold', label: t('header.gold'), value: t('result.gold', { amount: number(reward.gold) }), icon: 'coins' },
        ]
      }
      />
      {
        won &&
        <Text
          size={3}
          color="muted"
        >
          {t('result.saved')}
        </Text>
      }
      <Metrics items={
        [
          { id: 'damage', label: t('game.totalDamage'), value: number(run.totalDamage) },
          { id: 'turns', label: t('result.turns'), value: number(run.turn) },
          { id: 'hp', label: t('game.hp'), value: `${number(run.hp)} HP` },
        ]
      }
      />
      {
        run.endedAt &&
        <Text
          size={3}
          color="muted"
        >
          {t('result.date', { date: date(run.endedAt) })}
        </Text>
      }
      <div className={styles.actions}>
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

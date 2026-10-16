'use client'

import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'
import { useArcadeStore } from '@/modules/Dota/store/arcade'

import Button from '@/components/Button'
import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Text from '@/components/Text'
import { REWARDS } from '@/modules/Dota/arcade/reward-generator'

import styles from './index.module.scss'

const ArcadeReward = ({ onClose }) => {
  const { t, number } = useTranslation()
  const { run, chooseReward, nextStage } = useArcadeStore()
  const selected = REWARDS.find((entry) => entry.id === run.selectedReward)
  if (!['choosing-reward', 'transitioning'].includes(run.status)) return null

  return (
    <div className={styles.block}>
      <Text color="accent">
        {t('gauntlet.stageCleared', { stage: number(run.stage) })}
      </Text>
      <Text color="muted">
        {t('gauntlet.stageSummary', { damage: number(run.battle.totalDamage), spins: number(run.battle.turn), hp: number(run.battle.hp), max: number(run.maxHp) })}
      </Text>
      {
        selected ? (
          <div
            className={styles.confirmation}
            role="status"
          >
            <Icon
              name={selected.icon}
              size={40}
            />
            <Heading
              as="h3"
              size={3}
            >
              {t(selected.nameKey)}
            </Heading>
            <Text>
              {t('gauntlet.rewardApplied')}
            </Text>
          </div>
        ) : (
          <div className={styles.cards}>
            {
              run.choices.map((id) => {
                const entry = REWARDS.find((reward) => reward.id === id)
                const level = entry.type === 'rune' ? 1 : (run.upgrades[id] || 0) + 1
                const value = entry.type === 'rune' ? 0 : entry.value < 1 ? Math.round(entry.value * level * 100) : entry.value * level
                return (
                  <button
                    key={id}
                    type="button"
                    className={clsx(styles.card, styles[entry.rarity])}
                    onClick={() => chooseReward(id)}
                  >
                    <span className={styles.icon}>
                      <Icon
                        name={entry.icon}
                        size={32}
                      />
                    </span>
                    <span className={styles.rarity}>
                      {t(`gauntlet.rarities.${entry.rarity}`)}
                      {' '}
                      ·
                      {' '}
                      {t(`gauntlet.types.${entry.type}`)}
                    </span>
                    <Heading
                      as="span"
                      size={4}
                    >
                      {t(entry.nameKey)}
                    </Heading>
                    {
                      entry.type !== 'rune' &&
                      <Text
                        as="span"
                        size={3}
                        color="accent"
                      >
                        {t('gauntlet.level', { level: number(level), max: number(entry.maxLevel) })}
                      </Text>
                    }
                    <Text
                      as="span"
                      size={3}
                      color="muted"
                    >
                      {t(entry.descriptionKey, { value: number(value || 0) })}
                    </Text>
                  </button>
                )
              })
            }
          </div>
        )
      }
      <Button
        disabled={run.status !== 'transitioning'}
        onClick={() => { if (nextStage()) onClose() }}
      >
        {t('gauntlet.nextStage', { stage: number(run.stage + 1) })}
      </Button>
      <Text
        size={3}
        color="muted"
      >
        {t('gauntlet.savedHint')}
      </Text>
    </div>
  )
}

export default ArcadeReward

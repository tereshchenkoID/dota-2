'use client'

import { useEffect, useState } from 'react'

import { useTranslation } from '@/hooks/useTranslation'
import { useArcadeStore } from '@/modules/Dota/store/arcade'

import Badge from '@/components/Badge'
import Button from '@/components/Button'
import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Panel from '@/components/Panel'
import Text from '@/components/Text'
import { REWARDS } from '@/modules/Dota/arcade/reward-generator'
import { getRuneValues } from '@/modules/Dota/arcade/runes'
import { getUpgradeValue } from '@/modules/Dota/arcade/upgrades'

import styles from './index.module.scss'

const ArcadeReward = ({ onClose }) => {
  const { t, number } = useTranslation()
  const { run, chooseReward, nextStage } = useArcadeStore()
  const [showRewards, setShowRewards] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowRewards(true), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 850)
    return () => clearTimeout(timer)
  }, [run.id, run.stage])

  const selected = REWARDS.find((entry) => entry.id === run.selectedReward)

  if (!['choosing-reward', 'transitioning'].includes(run.status)) return null

  if (!showRewards && !selected) {
    return (
      <div className={styles.block}>
        <Icon
          name="trophy"
          size={48}
        />
        <Heading
          as="h3"
          size={2}
        >
          {t('gauntlet.stageCleared', { stage: number(run.stage) })}
        </Heading>
        <Text>
          {t('gauntlet.stageSummary', { damage: number(run.battle.totalDamage), spins: number(run.battle.turn), hp: number(run.battle.hp), max: number(run.maxHp) })}
        </Text>
        <Text color="accent">
          {t('progression.victorySummary', { blocked: number(run.victorySummary?.blocked || 0), recovery: number(run.victorySummary?.recovery || 0), spins: number(run.victorySummary?.bonusSpins || 0), healing: number(run.victorySummary?.healing || 0) })}
        </Text>
        <Text color="muted">
          {t('gauntlet.nextStage', { stage: number(run.stage + 1) })}
        </Text>
        <Button onClick={() => setShowRewards(true)}>
          {t('progression.skip')}
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.block}>
      <Text color="accent">
        {t('gauntlet.stageCleared', { stage: number(run.stage) })}
      </Text>
      <Text color="muted">
        {t('gauntlet.stageSummary', { damage: number(run.battle.totalDamage), spins: number(run.battle.turn), hp: number(run.battle.hp), max: number(run.maxHp) })}
      </Text>
      <Text
        size={3}
        color="muted"
      >
        {t('progression.victorySummary', { blocked: number(run.victorySummary?.blocked || 0), recovery: number(run.victorySummary?.recovery || 0), spins: number(run.victorySummary?.bonusSpins || 0), healing: number(run.victorySummary?.healing || 0) })}
      </Text>
      {
        selected ? (
          <Panel
            variant="raised"
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
          </Panel>
        ) : (
          <div className={styles.cards}>
            {
              run.choices.map((id) => {
                const entry = REWARDS.find((reward) => reward.id === id)
                const level = entry.type === 'rune' ? 1 : (run.upgrades[id] || 0) + 1
                const previous = entry.type === 'rune' ? 0 : entry.effect === 'maxHp' ? run.maxHp : getUpgradeValue(entry, level - 1)
                const value = entry.type === 'rune' ? 0 : entry.effect === 'maxHp' ? run.maxHp + entry.value : getUpgradeValue(entry, level)
                return (
                  <Panel
                    as="button"
                    interactive
                    key={id}
                    type="button"
                    className={styles.card}
                    onClick={() => chooseReward(id)}
                  >
                    <span className={styles.icon}>
                      <Icon
                        name={entry.icon}
                        size={32}
                      />
                    </span>
                    <Badge color={entry.rarity === 'common' ? 'neutral' : 'accent'}>
                      {t(`gauntlet.rarities.${entry.rarity}`)}
                      {' '}
                      ·
                      {' '}
                      {t(`gauntlet.types.${entry.type}`)}
                    </Badge>
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
                        {t('progression.levelChange', { current: number(level - 1), next: number(level), max: number(entry.maxLevel) })}
                      </Text>
                    }
                    <Text
                      as="span"
                      size={3}
                      color="muted"
                    >
                      {
                        entry.type === 'rune' ? t(entry.descriptionKey, getRuneValues(entry)) : t('progression.bonusChange', { stat: t(`progression.stats.${entry.effect === 'spins' ? 'extraSpins' : entry.effect === 'shields' ? 'startingShields' : entry.effect}`), before: entry.value < 1 ? t('progression.percent', { value: number(previous) }) : number(previous), after: entry.value < 1 ? t('progression.percent', { value: number(value) }) : number(value) })
                      }
                    </Text>
                    <Text
                      as="span"
                      size={4}
                      color="muted"
                    >
                      {t(entry.type === 'rune' ? 'progression.nextStageOnly' : 'progression.permanent')}
                    </Text>
                  </Panel>
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

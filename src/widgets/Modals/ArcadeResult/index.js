'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { useArcadeStore } from '@/modules/Dota/store/arcade'

import Button from '@/components/Button'
import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Link from '@/components/Link'
import Text from '@/components/Text'
import { getRunSeconds } from '@/modules/Dota/arcade/run-records'
import { RUNES } from '@/modules/Dota/arcade/runes'
import { UPGRADES } from '@/modules/Dota/arcade/upgrades'
import Metrics from '@/modules/Metrics'

import styles from './index.module.scss'

const ArcadeResult = ({ onClose }) => {
  const { t, number } = useTranslation()
  const { run, newRun, stats } = useArcadeStore()

  if (run.status !== 'defeated') return null

  const seconds = getRunSeconds(run)
  const rows = [
    ['duration', t('progression.duration', { minutes: number(Math.floor(seconds / 60)), seconds: number(seconds % 60) })],
    ['record', stats.bestStage],
    ['reached', run.maxStage],
    ['bosses', run.defeatedBosses],
    ['damage', run.totalDamage],
    ['spins', run.totalSpins],
  ]

  return (
    <div className={styles.block}>
      <div className={styles.emblem}>
        <Icon
          name="trophy"
          size={48}
        />
      </div>
      <Heading
        as="h3"
        size={2}
      >
        {t('gauntlet.title')}
      </Heading>
      <Text color="muted">
        {t(`gauntlet.defeat.${run.defeatReason}`)}
      </Text>
      {
        run.maxStage > run.recordAtStart &&
        <Text
          color="accent"
          weight="bold"
        >
          {t('gauntlet.newRecord', { stage: number(run.maxStage) })}
        </Text>
      }
      <Metrics items={rows.map(([key, value]) => ({ id: key, label: t(key === 'duration' ? 'progression.durationLabel' : key === 'record' ? 'progression.record' : `gauntlet.metrics.${key}`), value: typeof value === 'number' ? number(value) : value }))} />
      <Text>
        {t('gauntlet.build')}
      </Text>
      <ul className={styles.upgrades}>
        {
          UPGRADES.filter((entry) => run.upgrades[entry.id]).map((entry) => (
            <li
              className={styles.upgrade}
              key={entry.id}
            >
              <Icon
                name={entry.icon}
                size={18}
              />
              <span>
                {t(entry.nameKey)}
                {' '}
                {number(run.upgrades[entry.id])}
              </span>
            </li>
          ))
        }
      </ul>
      {
        !Object.values(run.upgrades).some(Boolean) &&
        <Text
          size={3}
          color="muted"
        >
          {t('gauntlet.noUpgrades')}
        </Text>
      }
      <Text>
        {t('progression.usedRunes')}
      </Text>
      <ul className={styles.upgrades}>
        {
          RUNES.filter((entry) => run.runeHistory?.[entry.id]).map((entry) => (
            <li
              className={styles.upgrade}
              key={entry.id}
            >
              <Icon
                name={entry.icon}
                size={18}
              />
              <span>
                {t(entry.nameKey)}
                {' '}
                ·
                {' '}
                {number(run.runeHistory[entry.id])}
              </span>
            </li>
          ))
        }
      </ul>
      {
        !Object.values(run.runeHistory || {}).some(Boolean) &&
        <Text
          size={3}
          color="muted"
        >
          {t('progression.noUsedRunes')}
        </Text>
      }
      <Button onClick={() => { if (newRun()) onClose() }}>
        {t('progression.tryAgain')}
      </Button>
      <Button
        as={Link}
        color="secondary"
        href="/dota/"
        onClick={onClose}
      >
        {t('progression.backToMenu')}
      </Button>
    </div>
  )
}

export default ArcadeResult

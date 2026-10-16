'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { useArcadeStore } from '@/modules/Dota/store/arcade'

import Button from '@/components/Button'
import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Link from '@/components/Link'
import Text from '@/components/Text'
import { UPGRADES } from '@/modules/Dota/arcade/upgrades'

import styles from './index.module.scss'

const ArcadeResult = ({ onClose }) => {
  const { t, number } = useTranslation()
  const { run, newRun } = useArcadeStore()
  if (run.status !== 'defeated') return null
  const rows = [
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
      <dl className={styles.stats}>
        {
          rows.map(([key, value]) => (
            <div
              className={styles.stat}
              key={key}
            >
              <Text
                as="dt"
                size={3}
                color="muted"
              >
                {t(`gauntlet.metrics.${key}`)}
              </Text>
              <Heading
                as="dd"
                size={3}
              >
                {number(value)}
              </Heading>
            </div>
          ))
        }
      </dl>
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
      <Button onClick={() => { if (newRun()) onClose() }}>
        {t('gauntlet.newRun')}
      </Button>
      <Link
        className={styles.link}
        href="/dota/"
        onClick={onClose}
      >
        {t('gauntlet.return')}
      </Link>
    </div>
  )
}

export default ArcadeResult

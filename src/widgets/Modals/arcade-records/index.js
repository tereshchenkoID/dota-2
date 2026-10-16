'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { useArcadeStore } from '@/modules/Dota/store/arcade'

import Heading from '@/components/Heading'
import Text from '@/components/Text'

import styles from './index.module.scss'

const ArcadeRecords = () => {
  const { t, number, date } = useTranslation()
  const stats = useArcadeStore((state) => state.stats)
  const metrics = [
    ['runs', stats.runs], ['best', stats.bestStage],
    ['average', stats.measuredRuns ? Math.round(stats.stageTotal / stats.measuredRuns * 100) / 100 : t('progression.notAvailable')],
    ['bosses', stats.bosses], ['damage', stats.damage],
    ['longest', stats.measuredRuns ? t('progression.duration', { minutes: number(Math.floor(stats.longestSeconds / 60)), seconds: number(stats.longestSeconds % 60) }) : t('progression.notAvailable')],
  ]

  return (
    <div className={styles.block}>
      <dl className={styles.stats}>
        {
          metrics.map(([key, value]) => (
            <div
              className={styles.stat}
              key={key}
            >
              <Text
                as="dt"
                size={3}
                color="muted"
              >
                {t(`progression.records.${key}`)}
              </Text>
              <Heading
                as="dd"
                size={4}
              >
                {
                  typeof value === 'number' ? number(value) : value
                }
              </Heading>
            </div>
          ))
        }
      </dl>
      <Heading
        as="h3"
        size={4}
      >
        {t('progression.recent')}
      </Heading>
      {
        stats.recent.length ? (
          <ol className={styles.recent}>
            {
              stats.recent.map((entry) => (
                <li
                  className={styles.entry}
                  key={entry.id}
                >
                  <Text weight="bold">
                    {t('gauntlet.stage', { stage: number(entry.stage) })}
                  </Text>
                  <Text
                    size={3}
                    color="muted"
                  >
                    {t(`gauntlet.defeat.${entry.reason}`)}
                  </Text>
                  <Text size={3}>
                    {t('progression.recordSummary', { damage: number(entry.damage), spins: number(entry.spins), minutes: number(Math.floor(entry.seconds / 60)), seconds: number(entry.seconds % 60) })}
                  </Text>
                  {
entry.endedAt &&
<Text
  size={3}
  color="muted"
>
  {date(entry.endedAt)}
</Text>
                  }
                </li>
              ))
            }
          </ol>
        ) : (
          <Text color="muted">
            {t('progression.noRecords')}
          </Text>
        )
      }
      <Text
        size={3}
        color="muted"
      >
        {t('progression.recordsHint')}
      </Text>
      {
stats.finished > stats.measuredRuns &&
<Text
  size={3}
  color="muted"
>
  {t('progression.legacyRecords')}
</Text>
      }
    </div>
  )
}

export default ArcadeRecords

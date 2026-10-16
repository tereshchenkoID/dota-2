'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { useArcadeStore } from '@/modules/Dota/store/arcade'

import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Text from '@/components/Text'
import { getBuildSummary } from '@/modules/Dota/arcade/build-summary'
import { getRuneValues } from '@/modules/Dota/arcade/runes'
import { getUpgradeValue, UPGRADES } from '@/modules/Dota/arcade/upgrades'

import styles from './index.module.scss'

const ArcadeBuild = () => {
  const { t, number } = useTranslation()
  const run = useArcadeStore((state) => state.run)
  if (run.status === 'idle') return (
    <Text>
      {t('gauntlet.noUpgrades')}
    </Text>
  )
  const summary = getBuildSummary(run)
  const upgrades = UPGRADES.filter((entry) => run.upgrades[entry.id])

  return (
    <div className={styles.block}>
      <Text color="accent">
        {t('gauntlet.stage', { stage: number(run.stage) })}
      </Text>
      <div className={styles.groups}>
        {
          summary.groups.map((group) => (
            <section
              className={styles.group}
              key={group.id}
            >
              <Heading
                as="h3"
                size={4}
              >
                {t(`gauntlet.types.${group.id}`)}
              </Heading>
              <dl className={styles.list}>
                {
                  group.rows.map(([key, value, format]) => (
                    <div
                      className={styles.row}
                      key={key}
                    >
                      <Text
                        as="dt"
                        size={3}
                        color="muted"
                      >
                        {t(`progression.stats.${key}`)}
                      </Text>
                      <Text
                        as="dd"
                        size={3}
                        weight="bold"
                      >
                        {
                          format === 'percent' ? t('progression.percent', { value: number(Math.round(value * 100)) }) : format === 'factor' ? t('progression.factor', { value: number(value) }) : number(value)
                        }
                      </Text>
                    </div>
                  ))
                }
              </dl>
            </section>
          ))
        }
      </div>
      {
summary.rune &&
<section className={styles.group}>
  <Heading
    as="h3"
    size={4}
  >
    {t(summary.rune.nameKey)}
  </Heading>
  <Text
    size={3}
    color="accent"
  >
    {t(run.preparedRune ? 'gauntlet.prepared' : summary.rune.durationType === 'attacks' ? 'gauntlet.attacksRemaining' : 'gauntlet.spinsRemaining', { count: number(run.activeRune?.remaining || 0) })}
  </Text>
  <Text
    size={3}
    color="muted"
  >
    {t(summary.rune.descriptionKey, getRuneValues(summary.rune))}
  </Text>
</section>
      }
      <Heading
        as="h3"
        size={4}
      >
        {t('gauntlet.build')}
      </Heading>
      {
        upgrades.length ? upgrades.map((upgrade) => (
          <section
            className={styles.upgrade}
            key={upgrade.id}
          >
            <Icon
              name={upgrade.icon}
              size={24}
            />
            <div className={styles.details}>
              <Text weight="semibold">
                {t(upgrade.nameKey)}
                {' '}
                ·
                {' '}
                {number(run.upgrades[upgrade.id])}
              </Text>
              <Text
                size={3}
                color="muted"
              >
                {t(upgrade.descriptionKey, { value: number(getUpgradeValue(upgrade, run.upgrades[upgrade.id])) })}
              </Text>
            </div>
          </section>
        )) : (
          <Text
            size={3}
            color="muted"
          >
            {t('gauntlet.noUpgrades')}
          </Text>
        )
      }
      <Text
        size={3}
        color="muted"
      >
        {t('progression.scopeHint')}
      </Text>
    </div>
  )
}

export default ArcadeBuild

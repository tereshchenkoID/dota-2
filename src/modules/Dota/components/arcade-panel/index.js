'use client'

import { useTranslation } from '@/hooks/useTranslation'

import Icon from '@/components/Icon'
import { MODIFIERS } from '@/modules/Dota/arcade/modifiers'
import { RUNES } from '@/modules/Dota/arcade/runes'
import { UPGRADES } from '@/modules/Dota/arcade/upgrades'

import styles from './index.module.scss'

const ArcadePanel = ({ run, best }) => {
  const { t, number } = useTranslation()
  const rune = RUNES.find((entry) => entry.id === (run.activeRune?.id || run.preparedRune))
  const modifier = MODIFIERS.find((entry) => entry.id === run.stageConfig?.modifier)
  const upgrades = UPGRADES.filter((entry) => run.upgrades[entry.id])

  return (
    <section
      className={styles.block}
      aria-label={t('gauntlet.build')}
    >
      <div className={styles.header}>
        <span className={styles.title}>
          {t('gauntlet.stage', { stage: number(run.stage) })}
        </span>
        <span>
          {t('gauntlet.best', { stage: number(best) })}
        </span>
        <span>
          {t(run.stageConfig.elite ? 'gauntlet.elite' : 'gauntlet.mode')}
        </span>
      </div>
      {
        modifier &&
        <div className={styles.curse}>
          <Icon
            name={modifier.icon}
            size={20}
          />
          <strong>
            {t(modifier.nameKey)}
          </strong>
          <span>
            {t(modifier.descriptionKey)}
          </span>
        </div>
      }
      <div
        className={styles.rune}
        role="status"
      >
        <Icon
          name={rune?.icon || 'gem'}
          size={20}
        />
        <span>
          {t(rune?.nameKey || 'gauntlet.noRune')}
        </span>
        {
          rune &&
          <span>
            {
              run.preparedRune ? t('gauntlet.prepared') : t(rune.durationType === 'attacks' ? 'gauntlet.attacksRemaining' : 'gauntlet.spinsRemaining', { count: number(run.activeRune.remaining) })
            }
          </span>
        }
      </div>
      <div className={styles.upgrades}>
        {
          upgrades.length ? (
            upgrades.map((upgrade) => (
              <details
                className={styles.upgrade}
                key={upgrade.id}
              >
                <summary
                  className={styles.summary}
                  title={t(upgrade.descriptionKey, { value: number(upgrade.value < 1 ? Math.round(upgrade.value * run.upgrades[upgrade.id] * 100) : upgrade.value * run.upgrades[upgrade.id]) })}
                >
                  <Icon
                    name={upgrade.icon}
                    size={20}
                  />
                  <span>
                    {t(upgrade.nameKey)}
                    {' '}
                    {number(run.upgrades[upgrade.id])}
                  </span>
                </summary>
                <p className={styles.description}>
                  {t(upgrade.descriptionKey, { value: number(upgrade.value < 1 ? Math.round(upgrade.value * run.upgrades[upgrade.id] * 100) : upgrade.value * run.upgrades[upgrade.id]) })}
                </p>
              </details>
            ))
          ) : (
            <p className={styles.empty}>
              {t('gauntlet.noUpgrades')}
            </p>
          )
        }
      </div>
    </section>
  )
}

export default ArcadePanel

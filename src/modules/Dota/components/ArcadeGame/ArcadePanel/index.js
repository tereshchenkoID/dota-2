'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'

import Icon from '@/components/Icon'
import { RUNES } from '@/modules/Dota/arcade/runes'
import { UPGRADES } from '@/modules/Dota/arcade/upgrades'
import GameButton from '@/modules/Dota/components/GameButton'

import styles from './index.module.scss'

const ArcadePanel = ({ run }) => {
  const { t, number } = useTranslation()
  const open = useModalStore((state) => state.openModal)
  const rune = RUNES.find((entry) => entry.id === (run.activeRune?.id || run.preparedRune))
  const activated = run.battle.turn === 0 && RUNES.find((entry) => entry.id === run.runeActivation)
  const upgrades = UPGRADES.filter((entry) => run.upgrades[entry.id])

  return (
    <section
      className={styles.block}
      aria-label={t('gauntlet.build')}
    >
      <div className={styles.controls}>
        <GameButton
          variant="secondary"
          type="button"
          onClick={() => open('arcade-build')}
        >
          <Icon
            name="layers"
            size={20}
          />
          {t('progression.currentBuild')}
        </GameButton>
        <GameButton
          variant="secondary"
          type="button"
          onClick={() => open('arcade-records')}
        >
          <Icon
            name="trophy"
            size={20}
          />
          {t('progression.arcadeRecords')}
        </GameButton>
      </div>
      <div
        className={styles.rune}
        role="status"
      >
        <Icon
          name={rune?.icon || activated?.icon || 'gem'}
          size={20}
        />
        <span>
          {
            activated ? t('progression.runeActivated', { name: t(activated.nameKey) }) : t(rune?.nameKey || 'gauntlet.noRune')
          }
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
          upgrades.map((upgrade) => (
            <GameButton
              variant="secondary"
              type="button"
              key={upgrade.id}
              onClick={() => open('arcade-build')}
              title={t(upgrade.nameKey)}
              aria-label={`${t(upgrade.nameKey)} ${number(run.upgrades[upgrade.id])}`}
            >
              <Icon
                name={upgrade.icon}
                size={22}
              />
              <span>
                {number(run.upgrades[upgrade.id])}
              </span>
            </GameButton>
          ))
        }
      </div>
    </section>
  )
}

export default ArcadePanel

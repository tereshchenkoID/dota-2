'use client'

import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'

import Icon from '@/components/Icon'
import { LINE_COLORS } from '@/modules/Dota/config/paylines'
import { SYMBOLS } from '@/modules/Dota/engine/spin'

import styles from './index.module.scss'

const SlotOutcome = ({ run, spinning }) => {
  const { t, number } = useTranslation()
  const matches = !spinning && run.matches.length > 0

  return (
    <div
      className={styles.overlay}
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        key={spinning ? 'spinning' : run.turn}
        className={clsx(styles.panel, !matches && styles.compact)}
      >
        {
          matches ? (
            <>
              <ul
                className={styles.combinations}
                aria-label={t('game.matches')}
              >
                {
                  run.matches.map((match) => (
                    <li
                      className={styles.item}
                      key={match.lineIndex}
                      style={{ '--color-win-line': LINE_COLORS[match.lineIndex] }}
                    >
                      <i className={styles.fill} />
                      <span>
                        {t('game.winningLine', { line: number(match.lineIndex + 1), count: number(match.count) })}
                        {' '}
                        {t(SYMBOLS.find((symbol) => symbol.id === match.id).nameKey)}
                      </span>
                    </li>
                  ))
                }
              </ul>
              <div className={styles.ability}>
                <Icon
                  className={styles.glyph}
                  name="sparkles"
                  size={18}
                />
                <strong className={styles.value}>
                  {t('abilities.' + run.lastAbility)}
                </strong>
                {
run.lastDamage > 0 &&
<b className={styles.value}>
  +
  {number(run.lastDamage)}
</b>
                }
              </div>
              {
run.lastBreakdown && run.lastDamage > 0 &&
<p className={styles.breakdown}>
  {t('progression.damageBreakdown', { base: number(run.lastBreakdown.base), upgrades: number(run.lastBreakdown.upgrades), rune: number(run.lastBreakdown.rune), total: number(run.lastDamage) })}
</p>
              }
              {
run.lastHealing > 0 &&
<p className={styles.healing}>
  <Icon
    className={styles.glyph}
    name="heart-pulse"
    size={16}
  />
  {t('game.healed', { amount: number(run.lastHealing) })}
</p>
              }
            </>
          ) : (
            <span className={styles.message}>
              <Icon
                className={styles.glyph}
                name={spinning ? 'hourglass' : 'sparkles'}
                size={18}
              />
              {t(spinning ? 'game.spinning' : run.turn ? 'game.noMatch' : 'game.ready')}
            </span>
          )
        }
      </div>
    </div>
  )
}

export default SlotOutcome

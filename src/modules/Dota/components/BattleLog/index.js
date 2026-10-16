'use client'
import { useTranslation } from '@/hooks/useTranslation'
import { useGameStore } from '@/modules/Dota/store/game'

import Heading from '@/components/Heading'
import Text from '@/components/Text'

import styles from './index.module.scss'
const BattleLog = ({ battle }) => {
  const { t, number } = useTranslation()
  const classicLog = useGameStore((s) => s.run.log)
  const log = battle?.log || classicLog
  return (
    <section className={styles.log}>
      <Heading
        as="h2"
        size={3}
      >
        {t('game.battleLog')}
      </Heading>
      <div aria-live="polite">
        {
          log.length ? (
            log.slice(0, 4).map((entry) => (
              <div
                className={styles.entry}
                key={entry.turn}
              >
                <Text
                  size={3}
                  color="muted"
                >
                  {t('game.logTurn', { turn: number(entry.turn) })}
                </Text>
                <div>
                  <Text>
                    {
                      entry.ability
                        ? t('abilities.' + entry.ability)
                        : t('game.noMatch')
                    }
                  </Text>
                  <Text
                    size={3}
                    color="muted"
                  >
                    {
                      entry.attack === -1
                        ? t('game.blocked')
                        : entry.attack > 0
                          ? t('game.logAttack', { damage: number(entry.attack) })
                          : t('game.logDamage', { damage: number(entry.damage) })
                    }
                  </Text>
                  {
                    entry.healing > 0 &&
                    <Text
                      size={3}
                      color="accent"
                    >
                      {t('game.logHealing', { healing: number(entry.healing) })}
                    </Text>
                  }
                </div>
              </div>
            ))
          ) : (
            <Text
              color="muted"
              className={styles.empty}
            >
              {t('game.logEmpty')}
            </Text>
          )
        }
      </div>
    </section>
  )
}

export default BattleLog

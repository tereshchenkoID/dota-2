import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'

import Icon from '@/components/Icon'

import styles from './index.module.scss'

const BattleStats = ({ run, maxHp = 100, feedback }) => {
  const { t, number } = useTranslation()

  return (
    <section className={styles.block}>
      <div className={styles.list}>
        <div
          key={`health-${run.turn}`}
          className={
            clsx(
              styles.stat,
              {
                [styles.healed]: run.lastHealing > 0
              }
            )
          }
        >
          <span className={styles.label}>
            <Icon
              name="heart"
              size={18}
            />
            {' '}
            <small className={styles.caption}>
              {t('game.hp')}
            </small>
          </span>
          <b className={styles.value}>
            {number(run.hp)}
            <small className={styles.caption}>
              {' '}
              /
              {' '}
              {number(maxHp)}
            </small>
          </b>
          <div
            className={styles.track}
            role="progressbar"
            aria-label={t('game.hp')}
            aria-valuenow={run.hp}
            aria-valuemin={0}
            aria-valuemax={maxHp}
          >
            <i
              className={styles.fill}
              style={{ '--health': `${(run.hp / maxHp) * 100}%` }}
            />
          </div>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>
            <Icon
              name="swords"
              size={18}
            />
            {' '}
            <small className={styles.caption}>
              {t('game.damage')}
            </small>
          </span>
          <b className={styles.value}>
            {number(run.lastDamage)}
          </b>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>
            <Icon
              name="flame"
              size={18}
            />
            {' '}
            <small className={styles.caption}>
              {t('game.totalDamage')}
            </small>
          </span>
          <b className={styles.value}>
            {number(run.totalDamage)}
          </b>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>
            <Icon
              name="shield"
              size={18}
            />
            {' '}
            <small className={styles.caption}>
              {t('game.shield')}
            </small>
          </span>
          <b className={styles.value}>
            {number(run.shields)}
          </b>
        </div>
      </div>
      <p className={styles.ability}>
        {
          feedback ||
          <span className={styles.label}>
            {t('game.ability')}
          </span>
        }
        <b className={styles.value}>
          {
            run.lastAbility
              ? t('abilities.' + run.lastAbility)
              : t('game.ready')
          }
        </b>
      </p>
    </section>
  )
}

export default BattleStats

import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'

import Icon from '@/components/Icon'

import styles from './index.module.scss'
const BattleStats = ({ run }) => {
  const { t, number } = useTranslation()
  return (
    <section className={styles.stats}>
      <div
        key={`health-${run.turn}`}
        className={
          clsx(
            styles.healthStat,
            styles.group,
            run.lastHealing > 0 && styles.healed,
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
            {number(100)}
          </small>
        </b>
        <div
          className={clsx(styles.healthTrack, styles.group)}
          role="progressbar"
          aria-label={t('game.hp')}
          aria-valuenow={run.hp}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <i
            className={styles.fill}
            style={{ '--health': `${run.hp}%` }}
          />
        </div>
      </div>
      <div className={styles.group}>
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
      <div className={styles.group}>
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
      <div className={styles.group}>
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
      <p className={styles.lastAbility}>
        <span className={styles.label}>
          {t('game.ability')}
        </span>
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

import Image from 'next/image'
import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'

import Icon from '@/components/Icon'
import { BOSS_CONFIG, getPhase } from '@/modules/Dota/config/boss'

import styles from './index.module.scss'

const PHASES = [null, styles.phase2, styles.phase3]
const RoshanBoss = ({ run, spinning, bossConfig = BOSS_CONFIG }) => {
  const { t, number } = useTranslation()
  const phase = getPhase(run.bossHp, bossConfig.maxHp)
  return (
    <section
      className={clsx(styles.boss, PHASES[phase])}
      aria-label={t('game.roshan')}
    >
      <Image
        width={800}
        height={921}
        className={styles.bossArt}
        src="/assets/bosses/roshan.jpg"
        alt={t('game.roshan')}
      />
      <div className={styles.bossTop}>
        <span className={clsx(styles.raidBadge, styles.label)}>
          <i className={styles.fill} />
          {t('game.live')}
        </span>
        <span className={clsx(styles.phaseBadge, styles.label)}>
          {t('game.phase', { phase: number(phase + 1) })}
        </span>
      </div>
      {
        run.lastDamage > 0 && !spinning &&
        <span
          key={`damage-${run.turn}`}
          className={clsx(styles.damagePopup, styles.label)}
        >
          −
          {number(run.lastDamage)}
        </span>
      }
      {
        run.lastDamage > 0 && !spinning &&
        <div
          key={`impact-${run.turn}`}
          className={styles.impactEffect}
        >
          <i className={styles.fill} />
          <i className={styles.fill} />
          <i className={styles.fill} />
        </div>
      }
      <div className={styles.bossInfo}>
        <span className={clsx(styles.bossLabel, styles.label)}>
          {t('game.bossLabel')}
        </span>
        <h2 className={styles.title}>
          {t('game.roshan')}
        </h2>
        <p className={styles.description}>
          {t(`game.phase${phase + 1}`)}
        </p>
        <div className={styles.hpLabel}>
          <span className={styles.label}>
            <Icon
              name="heart"
              size={21}
            />
          </span>
          <b className={styles.value}>
            {number(run.bossHp)}
            {' '}
            <small className={styles.caption}>
              /
              {number(bossConfig.maxHp)}
            </small>
          </b>
        </div>
        <div
          className={styles.bossHealth}
          role="progressbar"
          aria-label={t('game.roshan')}
          aria-valuenow={run.bossHp}
          aria-valuemin={0}
          aria-valuemax={bossConfig.maxHp}
        >
          <i
            className={styles.fill}
            style={{ '--health': `${(run.bossHp / bossConfig.maxHp) * 100}%` }}
          />
        </div>
        <div className={styles.attackInfo}>
          <span className={styles.label}>
            <Icon
              name="swords"
              size={16}
            />
            {' '}
            {t('game.attackIn', { count: number(bossConfig.attackInterval - (run.turn % bossConfig.attackInterval)) })}
          </span>
          <span className={styles.label}>
            {
              t('game.attackPower', {
              damage: number(bossConfig.phases[phase].damage),
            })
            }
          </span>
        </div>
      </div>
    </section>
  )
}

export default RoshanBoss

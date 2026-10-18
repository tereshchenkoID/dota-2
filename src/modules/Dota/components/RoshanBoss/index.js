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
    <div
      className={
        clsx(
          styles.block,
          PHASES[phase]
        )
      }
      aria-label={t('game.roshan')}
    >
      <Image
        width={800}
        height={921}
        className={styles.image}
        src="/assets/bosses/roshan.jpg"
        alt={t('game.roshan')}
      />
      <div className={styles.headline}>
        <span className={clsx(styles.badge, styles.raise)}>
          <i className={styles.fill} />
          {t('game.live')}
        </span>
        <span className={clsx(styles.badge, styles.phase)}>
          {t('game.phase', { phase: number(phase + 1) })}
        </span>
      </div>
      {
        run.lastDamage > 0 && !spinning &&
        <span
          key={`damage-${run.turn}`}
          className={styles.damage}
        >
          −
          {number(run.lastDamage)}
        </span>
      }
      {
        run.lastDamage > 0 && !spinning &&
        <div
          key={`impact-${run.turn}`}
          className={styles.impact}
        >
          <i className={styles.fill} />
          <i className={styles.fill} />
          <i className={styles.fill} />
        </div>
      }
      <div className={styles.info}>
        <span className={styles.label}>
          {t('game.bossLabel')}
        </span>
        <h2 className={styles.title}>
          {t('game.roshan')}
        </h2>
        <p className={styles.description}>
          {t(`game.phase${phase + 1}`)}
        </p>
        <div className={styles.hp}>
          <Icon
            name="heart"
            size={22}
            className={styles.icon}
          />
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
          className={styles.health}
          role="progressbar"
          aria-label={t('game.roshan')}
          aria-valuenow={run.bossHp}
          aria-valuemin={0}
          aria-valuemax={bossConfig.maxHp}
        >
          <i
            className={styles.scale}
            style={{ '--health': `${(run.bossHp / bossConfig.maxHp) * 100}%` }}
          />
        </div>
        <div className={styles.attack}>
          <span className={styles.label}>
            <Icon
              name="swords"
              size={16}
            />
            {' '}
            {t('game.attackIn', { count: number(bossConfig.attackInterval - (run.turn % bossConfig.attackInterval)) })}
          </span>
          <span className={styles.label}>
            {t('game.attackPower', { damage: number(bossConfig.phases[phase].damage) })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default RoshanBoss

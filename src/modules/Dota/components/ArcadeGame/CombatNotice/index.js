'use client'

import { useTranslation } from '@/hooks/useTranslation'

import Icon from '@/components/Icon'

import styles from './index.module.scss'

const CombatNotice = ({ battle }) => {
  const { t, number } = useTranslation()
  const key = battle.secondWindTriggered ? 'secondWind' : battle.lastBlockSource === 'rune' ? 'runeBlock' : battle.lastBlockSource ? 'shieldBlock' : 'attack'

  return (
    <span
      className={styles.block}
      role="status"
      aria-live="polite"
    >
      <Icon
        name={battle.secondWindTriggered ? 'wind' : battle.lastAttack > 0 ? 'swords' : 'shield'}
        size={18}
      />
      <span>
        {t(`progression.events.${key}`, { damage: number(battle.lastAttack), hp: number(battle.hp) })}
      </span>
    </span>
  )
}

export default CombatNotice

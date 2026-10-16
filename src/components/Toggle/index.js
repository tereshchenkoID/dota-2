'use client'

import Icon from '@/components/Icon'

import styles from './index.module.scss'

const Toggle = ({
  checked,
  onChange,
  label,
  onLabel,
  offLabel,
  showLabel = true,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={styles.block}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.track}>
        <span className={styles.thumb}>
          {
            checked &&
            <Icon
              name="check"
              size={13}
              strokeWidth={3}
            />
          }
        </span>
      </span>
      {
        showLabel &&
        <span className={styles.status}>
          {
            checked ? onLabel : offLabel
          }
        </span>
      }
    </button>
  )
}

export default Toggle

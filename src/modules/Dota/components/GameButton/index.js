import clsx from 'clsx'

import styles from './index.module.scss'

const VARIANTS = { primary: styles.primary, secondary: styles.secondary }

const GameButton = ({
  children,
  variant = 'primary',
  size = 'default',
  square = false,
  fullWidth = false,
  className,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={
        clsx(
          styles.block,
          VARIANTS[variant],
          size === 'large' && styles.large,
          square && styles.square,
          fullWidth && styles.full,
          className,
        )
      }
      {...props}
    >
      {children}
    </button>
  )
}

export default GameButton

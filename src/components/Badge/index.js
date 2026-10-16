import clsx from 'clsx'

import styles from './index.module.scss'

const Badge = ({
  children,
  color = 'neutral',
  className, ...props
}) => {
  return (
    <span
      className={
        clsx(
          styles.block,
          styles[color],
          className
        )
      }
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge

import clsx from 'clsx'

import styles from './index.module.scss'

const Progress = ({
  value,
  max = 100,
  label,
  className
}) => {
  return (
    <progress
      className={
        clsx(
          styles.block,
          className
        )
      }
      value={value}
      max={max}
      aria-label={label}
    />
  )
}

export default Progress

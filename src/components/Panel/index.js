import clsx from 'clsx'

import styles from './index.module.scss'

const Panel = ({
  as: Component = 'section',
  variant = 'default',
  padding = 2,
  interactive = false,
  selected = false,
  className,
  children,
  ...props
}) => {
  return (
    <Component
      className={
        clsx(
          styles.block,
          styles[variant],
          styles[`padding-${padding}`],
          {
            [styles.interactive]: interactive,
            [styles.selected]: selected,
          },
          className
        )
      }
      {...props}
    >
      {children}
    </Component>
  )
}

export default Panel

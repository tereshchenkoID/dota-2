import clsx from 'clsx'

import styles from './index.module.scss'

const Button = ({
  as: Component = 'button',
  children,
  color = 'primary',
  type = 'button',
  square = false,
  full = false,
  selected = false,
  className,
  ...props
}) => {
  return (
    <Component
      type={Component === 'button' ? type : undefined}
      className={
        clsx(
          styles.block,
          styles[color],
          {
            [styles.square]: square,
            [styles.full]: full,
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

export default Button

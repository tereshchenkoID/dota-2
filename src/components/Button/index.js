import clsx from 'clsx'

import styles from './index.module.scss'

const Button = ({
  children,
  color = 'primary',
  type = 'button',
  square = false,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      className={
        clsx(
          styles.block,
          styles[color],
          {
            [styles.square]: square,
          },
          className
        )
      }
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

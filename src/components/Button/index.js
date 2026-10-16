import clsx from 'clsx'

import styles from './index.module.scss'

const Button = ({
  children,
  color = 'primary',
  type = 'button',
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

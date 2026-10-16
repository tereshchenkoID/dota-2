import clsx from 'clsx'

import styles from './index.module.scss'

const Text = ({
  as: Tag = 'p',
  size = 2,
  color = 'default',
  weight,
  className = '',
  children,
  ...props
}) => (
  <Tag
    className={
      clsx(
        styles.block,
        styles[`size-${size}`],
        styles[color],
        weight && styles[weight],
        className
      )
    }
    {...props}
  >
    {children}
  </Tag>
)

export default Text

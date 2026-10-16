import clsx from 'clsx'

import styles from './index.module.scss'

const Heading = ({
  as: Tag = 'h2',
  size = 2,
  className = '',
  children,
  ...props
}) => {
  return (
    <Tag
      className={
        clsx(
          styles.block,
          styles[`size-${size}`],
          className
        )
      }
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Heading

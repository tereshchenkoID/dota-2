import clsx from 'clsx'

import styles from './index.module.scss'

const Container = ({
  as: Component = 'div',
  children,
  className,
  ...props
}) => {
  return (
    <Component
      className={
        clsx(
          styles.block,
          className
        )
      }
      {...props}
    >
      {children}
    </Component>
  )
}

export default Container

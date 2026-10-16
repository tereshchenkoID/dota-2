import Button from '@/components/Button'
import Icon from '@/components/Icon'
import Link from '@/components/Link'

import styles from './index.module.scss'

const Action = ({ icon, children, href, ...props }) => {
  return (
    <Button
      className={styles.block}
      as={href ? Link : 'button'}
      href={href}
      color="secondary"
      full
      {...props}
    >
      <span className={styles.label}>
        {
          icon &&
          <Icon
            name={icon}
            size={20}
          />
        }
        {children}
      </span>
      <Icon
        name="chevron-right"
        size={20}
      />
    </Button>
  )
}

export default Action

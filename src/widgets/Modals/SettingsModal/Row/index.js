import Icon from '@/components/Icon'
import Text from '@/components/Text'

import styles from './index.module.scss'

const Row = ({ label, description, icon, children }) => {
  return (
    <div className={styles.block}>
      <div className={styles.copy}>
        <Text
          weight="semibold"
          className={styles.label}
        >
          {
            icon &&
            <Icon
              name={icon}
              size={20}
            />
          }
          {label}
        </Text>
        {
          description &&
          <Text
            size={3}
            color="muted"
          >
            {description}
          </Text>
        }
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}

export default Row

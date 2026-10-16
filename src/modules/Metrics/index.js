import clsx from 'clsx'

import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Panel from '@/components/Panel'
import Text from '@/components/Text'

import styles from './index.module.scss'

const Metrics = ({ items, className }) => {
  return (
    <div className={
      clsx(
        styles.block,
        className
      )
    }
    >
      {
        items.map(({ id, label, value, icon }) =>
          <Panel
            as="div"
            key={id || label}
            variant="raised"
            className={styles.item}
          >
            <Text
              as="dt"
              size={3}
              color="muted"
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
            <Heading
              as="dd"
              size={3}
            >
              {value}
            </Heading>
          </Panel>
        )
      }
    </div>
  )
}

export default Metrics

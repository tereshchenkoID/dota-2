import { useTranslation } from '@/hooks/useTranslation'

import Badge from '@/components/Badge'
import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Panel from '@/components/Panel'
import Text from '@/components/Text'

import styles from './index.module.scss'

const ICONS = {
  league: 'swords',
  counter: 'crosshair',
  valorant: 'shield',
  warcraft: 'crown',
}

const Upcoming = ({ id, title, mark, genre, accent }) => {
  const { t } = useTranslation()

  return (
    <Panel
      as="article"
      padding={0}
      className={styles.block}
      style={{ '--color-card-accent': accent }}
      aria-labelledby={`upcoming-${id}`}
    >
      <div className={styles.art}>
        <div className={styles.orbit} />
        <Icon
          name={ICONS[id]}
          size={64}
          strokeWidth={1}
          className={styles.decor}
        />
        <span className={styles.mark}>
          {mark}
        </span>
        <Text
          as="span"
          size={5}
          weight="bold"
          color="current"
          className={styles.genre}
        >
          {genre}
        </Text>
      </div>
      <div className={styles.content}>
        <Badge color="accent">
          <Icon
            name="clock-3"
            size={14}
          />
          <Text
            as="span"
            size={4}
            weight="semibold"
            color="current"
          >
            {t('home.comingSoon')}
          </Text>
        </Badge>
        <Heading
          id={`upcoming-${id}`}
          as="h3"
          size={3}
        >
          {title}
        </Heading>
        <Text
          size={3}
          color="muted"
        >
          {t(`home.preview.${id}`)}
        </Text>
        <Text
          as="span"
          size={4}
          color="muted"
          className={styles.note}
        >
          {t('home.inDevelopment')}
        </Text>
      </div>
    </Panel>
  )
}

export default Upcoming

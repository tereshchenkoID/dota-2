import { useTranslation } from '@/hooks/useTranslation'

import Badge from '@/components/Badge'
import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Panel from '@/components/Panel'
import Text from '@/components/Text'

import styles from './index.module.scss'

const STEPS = [
  { key: 'choose', icon: 'gamepad-2' },
  { key: 'rules', icon: 'circle-question-mark' },
  { key: 'progress', icon: 'save' },
]

const ArcadeGuide = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.guide}>
      <Text color="muted">
        {t('arcadeGuide.intro')}
      </Text>
      <div className={styles.steps}>
        {
          STEPS.map(({ key, icon }) => (
            <Panel
              variant="raised"
              className={styles.step}
              key={key}
            >
              <Badge color="accent">
                <Icon
                  name={icon}
                  size={20}
                />
              </Badge>
              <div>
                <Heading
                  className={styles.title}
                  as="h3"
                  size={5}
                >
                  {t(`arcadeGuide.${key}Title`)}
                </Heading>
                <Text
                  size={3}
                  color="muted"
                >
                  {t(`arcadeGuide.${key}Body`)}
                </Text>
              </div>
            </Panel>
          ))
        }
      </div>
      <Text
        size={3}
        color="muted"
      >
        {t('game.freeArcade')}
      </Text>
    </div>
  )
}

export default ArcadeGuide

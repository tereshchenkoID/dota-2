import { useTranslation } from '@/hooks/useTranslation'

import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
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
            <section
              className={styles.step}
              key={key}
            >
              <span className={styles.icon}>
                <Icon
                  name={icon}
                  size={22}
                />
              </span>
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
            </section>
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

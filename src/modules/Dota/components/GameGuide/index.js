import Image from 'next/image'

import { useTranslation } from '@/hooks/useTranslation'

import Heading from '@/components/Heading'
import Panel from '@/components/Panel'
import Text from '@/components/Text'
import { HEROES } from '@/modules/Dota/config/heroes'
import { ITEMS } from '@/modules/Dota/config/items'
import { PAYLINES } from '@/modules/Dota/config/paylines'

import styles from './index.module.scss'

const GameGuide = ({ compact = false }) => {
  const { t, number } = useTranslation()
  return (
    <div>
      <div className={styles.guideHeading}>
        <div>
          <Text
            as="span"
            size={4}
            color="accent"
          >
            {t('guide.heroes')}
          </Text>
          <Heading
            as="h2"
            size={3}
          >
            {t('guide.title')}
          </Heading>
        </div>
        <Text
          size={3}
          color="muted"
          className={styles.description}
        >
          {t('guide.subtitle')}
        </Text>
      </div>
      <div className={styles.heroes}>
        {
          HEROES.map((h) => (
            <div
              className={styles.hero}
              key={h.id}
            >
              <Image
                className={styles.image}
                width={256}
                height={144}
                src={h.image}
                alt=""
              />
              <div>
                <Heading
                  as="h3"
                  size={5}
                >
                  {t(h.nameKey)}
                </Heading>
                <Text
                  size={3}
                  color="muted"
                  className={styles.description}
                >
                  {t('abilities.' + h.ability)}
                </Text>
                {
                  !compact &&
                  <>
                    <Text
                      as="span"
                      size={4}
                      color="accent"
                    >
                      {t('guide.damage', { damage: number(h.baseDamage) })}
                    </Text>
                    <Text
                      size={3}
                      color="muted"
                      className={styles.description}
                    >
                      {t('guide.five')}
                      :
                      {t('abilities.' + h.ultimate)}
                    </Text>
                  </>
                }
              </div>
            </div>
          ))
        }
      </div>
      {
        !compact &&
        <>
          <Heading
            as="h3"
            size={4}
            className={styles.sectionTitle}
          >
            {t('guide.lines')}
          </Heading>
          <Text color="muted">
            {t('guide.rules')}
          </Text>
          <div className={styles.lines}>
            {
              PAYLINES.map((line, i) => (
                <Panel
                  padding={1}
                  className={styles.line}
                  key={i}
                >
                  <svg
                    className={styles.glyph}
                    viewBox="0 0 100 58"
                  >
                    {
                      Array.from({ length: 15 }, (_, n) => (
                        <circle
                          key={n}
                          cx={(n % 5) * 20 + 10}
                          cy={Math.floor(n / 5) * 20 + 8}
                          r="2"
                          fill="var(--color-border)"
                        />
                      ))
                    }
                    <polyline
                      points={
                        line
                          .map((r, c) => `${c * 20 + 10},${r * 20 + 8}`)
                          .join(' ')
                      }
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="2"
                    />
                  </svg>
                  <Text
                    as="span"
                    size={4}
                    color="accent"
                  >
                    {t('guide.line' + (i + 1))}
                  </Text>
                </Panel>
              ))
            }
          </div>
          <Text color="muted">
            {t('guide.weights')}
          </Text>
          <Heading
            as="h3"
            size={4}
            className={styles.sectionTitle}
          >
            {t('guide.items')}
          </Heading>
          <Text color="muted">
            {t('guide.itemsRule')}
          </Text>
          <div className={styles.items}>
            {
              ITEMS.map((item) => (
                <div
                  className={styles.hero}
                  key={item.id}
                >
                  <Image
                    className={styles.image}
                    width={256}
                    height={144}
                    src={item.image}
                    alt=""
                  />
                  <div>
                    <Heading
                      as="h3"
                      size={5}
                    >
                      {t(item.nameKey)}
                    </Heading>
                    <Text
                      size={3}
                      color="muted"
                      className={styles.description}
                    >
                      {t('item.' + item.id)}
                    </Text>
                  </div>
                </div>
              ))
            }
          </div>
        </>
      }
    </div>
  )
}

export default GameGuide

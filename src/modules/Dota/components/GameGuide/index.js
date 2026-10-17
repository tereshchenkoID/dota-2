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
      <div className={styles.headline}>
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
        <Text
          size={3}
          color="muted"
        >
          {t('guide.subtitle')}
        </Text>
      </div>
      <div className={styles.grid}>
        {
          HEROES.map((el) => (
            <div
              key={el.id}
              className={styles.hero}
            >
              <Image
                className={styles.image}
                width={256}
                height={144}
                src={el.image}
                alt={el.id}
              />
              <div>
                <Heading
                  as="h3"
                  size={5}
                >
                  {t(el.nameKey)}
                </Heading>
                <Text
                  size={3}
                  color="muted"
                >
                  {t('abilities.' + el.ability)}
                </Text>
                {
                  !compact &&
                  <>
                    <Text
                      as="span"
                      size={4}
                      color="accent"
                    >
                      {t('guide.damage', { damage: number(el.baseDamage) })}
                    </Text>
                    <Text
                      size={3}
                      color="muted"
                    >
                      {t('guide.five')}
                      :
                      {' '}
                      <strong>
                        {t('abilities.' + el.ultimate)}
                      </strong>
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
          <div className={styles.headline}>
            <Heading
              as="h3"
              size={4}
            >
              {t('guide.lines')}
            </Heading>
            <Text color="muted">
              {t('guide.rules')}
            </Text>
          </div>
          <div className={styles.lines}>
            {
              PAYLINES.map((el, i) => (
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
                        el
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
          <div className={styles.headline}>
            <Heading
              as="h3"
              size={4}
            >
              {t('guide.items')}
            </Heading>
            <Text color="muted">
              {t('guide.itemsRule')}
            </Text>
          </div>
          <div className={styles.grid}>
            {
              ITEMS.map((el) =>
                <div
                  className={styles.hero}
                  key={el.id}
                >
                  <Image
                    className={styles.image}
                    width={256}
                    height={144}
                    src={el.image}
                    alt={el.id}
                  />
                  <div>
                    <Heading
                      as="h3"
                      size={5}
                    >
                      {t(el.nameKey)}
                    </Heading>
                    <Text
                      size={3}
                      color="muted"
                    >
                      {t('item.' + el.id)}
                    </Text>
                  </div>
                </div>
              )
            }
          </div>
        </>
      }
    </div>
  )
}

export default GameGuide

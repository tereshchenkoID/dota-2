import Image from 'next/image'
import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'

import { HEROES } from '@/modules/Dota/config/heroes'
import { ITEMS } from '@/modules/Dota/config/items'
import { PAYLINES } from '@/modules/Dota/config/paylines'

import styles from './index.module.scss'
const GameGuide = ({ compact = false }) => {
  const { t, number } = useTranslation()
  return (
    <div className={clsx(styles.guide, styles.group)}>
      <div className={clsx(styles.guideHeading, styles.group)}>
        <div className={styles.group}>
          <span className={styles.eyebrow}>
            {t('guide.heroes')}
          </span>
          <h2 className={styles.title}>
            {t('guide.title')}
          </h2>
        </div>
        <p className={styles.description}>
          {t('guide.subtitle')}
        </p>
      </div>
      <div className={clsx(styles.heroes, styles.group)}>
        {
          HEROES.map((h) => (
            <div
              className={clsx(styles.hero, styles.group)}
              key={h.id}
            >
              <Image
                className={styles.image}
                width={256}
                height={144}
                src={h.image}
                alt=""
              />
              <div className={styles.group}>
                <h3 className={styles.title}>
                  {t(h.nameKey)}
                </h3>
                <p className={styles.description}>
                  {t('abilities.' + h.ability)}
                </p>
                {
                  !compact &&
                  <>
                    <small className={styles.caption}>
                      {t('guide.damage', { damage: number(h.baseDamage) })}
                    </small>
                    <p className={styles.description}>
                      {t('guide.five')}
                      :
                      {t('abilities.' + h.ultimate)}
                    </p>
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
          <h3 className={clsx(styles.sectionTitle, styles.title)}>
            {t('guide.lines')}
          </h3>
          <p className={clsx(styles.rules, styles.description)}>
            {t('guide.rules')}
          </p>
          <div className={clsx(styles.lines, styles.group)}>
            {
              PAYLINES.map((line, i) => (
                <div
                  className={styles.group}
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
                          fill="#50638a"
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
                      stroke="#a9bcff"
                      strokeWidth="2"
                    />
                  </svg>
                  <small className={styles.caption}>
                    {t('guide.line' + (i + 1))}
                  </small>
                </div>
              ))
            }
          </div>
          <p className={clsx(styles.rules, styles.description)}>
            {t('guide.weights')}
          </p>
          <h3 className={clsx(styles.sectionTitle, styles.title)}>
            {t('guide.items')}
          </h3>
          <p className={clsx(styles.rules, styles.description)}>
            {t('guide.itemsRule')}
          </p>
          <div className={clsx(styles.items, styles.group)}>
            {
              ITEMS.map((item) => (
                <div
                  className={clsx(styles.hero, styles.group)}
                  key={item.id}
                >
                  <Image
                    className={styles.image}
                    width={256}
                    height={144}
                    src={item.image}
                    alt=""
                  />
                  <div className={styles.group}>
                    <h3 className={styles.title}>
                      {t(item.nameKey)}
                    </h3>
                    <p className={styles.description}>
                      {t('item.' + item.id)}
                    </p>
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

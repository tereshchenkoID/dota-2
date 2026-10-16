'use client'

import { useState } from 'react'

import { useTranslation } from '@/hooks/useTranslation'

import Button from '@/components/Button'
import Heading from '@/components/Heading'
import Panel from '@/components/Panel'
import Progress from '@/components/Progress'
import Text from '@/components/Text'
import {
  getBuildProgress, getDamageSources, getHeroPreview, getItemPreview
} from '@/modules/Dota/arcade/build-impact'
import { HEROES } from '@/modules/Dota/config/heroes'

import styles from '../index.module.scss'

const ITEMS = [
  ['divine-rapier', 'damage'],
  ['healing-salve', 'healing'],
  ['butterfly', 'extraSpins'],
  ['black-king-bar', 'shields'],
]

const Impact = ({ run }) => {
  const { t, number } = useTranslation()
  const [count, setCount] = useState(3)
  const progress = getBuildProgress(run)
  const sources = getDamageSources(run)

  return (
    <Panel
      variant="raised"
      className={styles.group}
    >
      <Heading
        as="h3"
        size={4}
      >
        {t('buildImpact.title')}
      </Heading>
      <Text
        size={3}
        color="accent"
      >
        {t('buildImpact.levels', { highest: number(progress.highest), max: number(progress.maximum), total: number(progress.total), capacity: number(progress.capacity) })}
      </Text>
      <Progress
        value={progress.highest}
        max={progress.maximum}
        label={t('buildImpact.highest')}
      />
      <Text
        size={3}
        color="muted"
      >
        {t('buildImpact.levelHint', { max: number(progress.maximum), capacity: number(progress.capacity) })}
      </Text>
      <div className={styles.resources}>
        <Text size={3}>
          {t('buildImpact.health', { base: number(progress.startingHp), value: number(run.maxHp) })}
        </Text>
        <Text size={3}>
          {t('buildImpact.spins', { base: number(progress.baseSpins), value: number(progress.startingSpins) })}
        </Text>
      </div>
      <Text
        size={3}
        weight="bold"
      >
        {t('buildImpact.preview')}
      </Text>
      <div
        className={styles.controls}
        role="group"
        aria-label={t('buildImpact.matchSize')}
      >
        {
          [3, 4, 5].map((value) => (
            <Button
              color="secondary"
              selected={count === value}
              type="button"
              aria-pressed={count === value}
              key={value}
              onClick={() => setCount(value)}
            >
              {t('buildImpact.match', { count: number(value) })}
            </Button>
          ))
        }
      </div>
      <dl className={styles.examples}>
        {
          HEROES.map((hero) => {
            const preview = getHeroPreview(run, hero.id, count)
            return (
              <div
                className={styles.example}
                key={hero.id}
              >
                <Text
                  as="dt"
                  size={3}
                >
                  {t(hero.nameKey)}
                </Text>
                <Text
                  as="dd"
                  size={3}
                  weight="bold"
                  color="accent"
                >
                  {t('buildImpact.damage', { base: number(preview.base), value: number(preview.total), bonus: number(preview.bonus), rune: number(preview.rune) })}
                </Text>
              </div>
            )
          })
        }
      </dl>
      <Text
        size={3}
        weight="bold"
      >
        {t('buildImpact.items')}
      </Text>
      <dl className={styles.examples}>
        {
          ITEMS.map(([id, field]) => {
            const preview = getItemPreview(run, id, field, count)
            return (
              <div
                className={styles.example}
                key={id}
              >
                <Text
                  as="dt"
                  size={3}
                >
                  {t(`symbols.${id}`)}
                </Text>
                <Text
                  as="dd"
                  size={3}
                  color="accent"
                >
                  {t(`buildImpact.itemStats.${field}`, { base: number(preview.base), value: number(preview.value) })}
                </Text>
              </div>
            )
          })
        }
      </dl>
      <Text
        size={4}
        color="muted"
      >
        {t('buildImpact.previewHint')}
      </Text>
      <Text
        size={3}
        weight="bold"
      >
        {t('buildImpact.tracked', { total: number(sources.tracked) })}
      </Text>
      <Text
        size={3}
        color="accent"
      >
        {t('progression.damageBreakdown', { base: number(sources.base), upgrades: number(sources.upgrades), rune: number(sources.rune), total: number(sources.tracked) })}
      </Text>
      <Text
        size={4}
        color="muted"
      >
        {t('buildImpact.trackedHint')}
      </Text>
    </Panel>
  )
}

export default Impact

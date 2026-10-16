'use client'

import { useState } from 'react'
import Image from 'next/image'

import { useTranslation } from '@/hooks/useTranslation'
import { useProfileStore } from '@/store/profile'

import Icon from '@/components/Icon'
import Input from '@/components/Input'
import Panel from '@/components/Panel'
import Text from '@/components/Text'
import AVATARS from '@/modules/Dota/config/avatars.json'

import styles from './index.module.scss'

const AvatarModal = ({ onClose }) => {
  const [query, setQuery] = useState('')
  const { t, number } = useTranslation()
  const { avatar, setAvatar } = useProfileStore()
  const filtered = AVATARS.filter((hero) =>
    hero.name.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <div>
      <Input
        icon="search"
        aria-label={t('profile.search')}
        placeholder={t('profile.search')}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Text
        size={3}
        color="muted"
        className={styles.count}
        aria-live="polite"
      >
        {t('profile.heroCount', { count: number(filtered.length) })}
      </Text>
      <div className={styles.grid}>
        {
          filtered.map((hero) => (
            <Panel
              as="button"
              padding={1}
              interactive
              selected={hero.id === avatar}
              className={styles.control}
              type="button"
              key={hero.id}
              aria-label={hero.name}
              aria-pressed={hero.id === avatar}
              onClick={
                () => {
                  setAvatar(hero.id)
                  onClose()
                }
              }
            >
              <Image
                className={styles.image}
                width={256}
                height={144}
                src={`/assets/avatars/${hero.id}.png`}
                alt=""
                loading="lazy"
              />
              <Text
                className={styles.label}
                as="span"
                size={4}
              >
                {hero.name}
              </Text>
              {
                hero.id === avatar &&
                <Icon
                  className={styles.glyph}
                  name="check"
                  size={20}
                />
              }
            </Panel>
          ))
        }
      </div>
      {
        !filtered.length &&
        <Text>
          {t('profile.empty')}
        </Text>
      }
    </div>
  )
}

export default AvatarModal

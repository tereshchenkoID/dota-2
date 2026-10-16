'use client'

import Image from 'next/image'
import clsx from 'clsx'

import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'
import { useProfileStore } from '@/store/profile'
import { useGameStore } from '@/modules/Dota/store/game'

import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Link from '@/components/Link'
import Text from '@/components/Text'
import { BALANCE } from '@/modules/Dota/config/balance'

import styles from './index.module.scss'

const ProfileModal = () => {
  const { t, number } = useTranslation()
  const { username, avatar, setUsername } = useProfileStore()
  const { openModal, closeAllModals } = useModalStore()
  const progress = useGameStore((s) => s.progress)
  const earned = progress.xp % BALANCE.xpPerLevel

  return (
    <div className={clsx(styles.panel, styles.group)}>
      <div className={clsx(styles.identity, styles.group)}>
        <button
          type="button"
          className={styles.avatar}
          onClick={() => openModal('avatar')}
          aria-label={t('profile.changeAvatar')}
        >
          <Image
            className={styles.image}
            width={256}
            height={144}
            src={`/assets/avatars/${avatar}.png`}
            alt={avatar}
          />
          <span className={styles.label}>
            <Icon
              className={styles.glyph}
              name="image-plus"
              size={18}
            />
          </span>
        </button>
        <div className={styles.group}>
          <Text
            size={3}
            color="muted"
          >
            {t('profile.player')}
          </Text>
          <Heading
            as="strong"
            size={3}
            className={clsx(styles.username, styles.value)}
          >
            {
              username.trim() || 'Player'
            }
          </Heading>
          <button
            type="button"
            className={styles.textButton}
            onClick={() => openModal('avatar')}
          >
            {t('profile.changeAvatar')}
          </button>
        </div>
      </div>
      <Text
        as="label"
        size={3}
        color="muted"
        className={styles.nameLabel}
      >
        {t('profile.username')}
        <input
          className={styles.input}
          value={username}
          maxLength={24}
          onChange={(event) => setUsername(event.target.value)}
          onBlur={
            () => {
              if (!username.trim()) setUsername('Player')
            }
          }
          autoComplete="nickname"
        />
      </Text>
      <section className={styles.levelCard}>
        <div className={clsx(styles.levelHeading, styles.group)}>
          <Heading
            as="span"
            size={3}
            className={clsx(styles.badge, styles.label)}
          >
            {number(progress.level)}
          </Heading>
          <div className={styles.group}>
            <Text
              size={3}
              color="muted"
            >
              {t('header.experience')}
            </Text>
            <Heading
              className={styles.value}
              as="strong"
              size={4}
            >
              {t('header.level', { level: number(progress.level) })}
            </Heading>
          </div>
        </div>
        <div
          className={clsx(styles.progress, styles.group)}
          role="progressbar"
          aria-label={t('header.experience')}
          aria-valuenow={earned}
          aria-valuemin={0}
          aria-valuemax={BALANCE.xpPerLevel}
        >
          <i
            className={styles.fill}
            style={{ width: `${(earned / BALANCE.xpPerLevel) * 100}%` }}
          />
        </div>
        <div className={clsx(styles.xpLabel, styles.group)}>
          <Text
            className={styles.label}
            as="span"
            size={4}
            color="linkHover"
          >
            {number(earned)}
            {' '}
            /
            {number(BALANCE.xpPerLevel)}
            {' '}
            XP
          </Text>
          <Text
            className={styles.label}
            as="span"
            size={4}
            color="linkHover"
          >
            {
              t('profile.nextLevel', {
              amount: number(BALANCE.xpPerLevel - earned),
            })
            }
          </Text>
        </div>
        <Text
          size={3}
          color="muted"
        >
          {t('profile.totalXp', { amount: number(progress.xp) })}
        </Text>
      </section>
      <div className={clsx(styles.summary, styles.group)}>
        <div className={styles.group}>
          <Icon
            className={styles.glyph}
            name="coins"
            size={20}
          />
          <Text
            className={styles.label}
            as="span"
            size={3}
            color="current"
          >
            {t('header.gold')}
          </Text>
          <Heading
            className={styles.value}
            as="strong"
            size={3}
          >
            {number(progress.gold)}
          </Heading>
        </div>
        <div className={styles.group}>
          <Icon
            className={styles.glyph}
            name="trophy"
            size={20}
          />
          <Text
            className={styles.label}
            as="span"
            size={3}
            color="current"
          >
            {t('stats.wins')}
          </Text>
          <Heading
            className={styles.value}
            as="strong"
            size={3}
          >
            {number(progress.wins)}
          </Heading>
        </div>
      </div>
      <button
        type="button"
        className={styles.item}
        onClick={() => openModal('settings')}
      >
        <span className={styles.label}>
          <Icon
            className={styles.glyph}
            name="settings"
            size={20}
          />
          {t('header.settings')}
        </span>
        <Icon
          className={styles.glyph}
          name="arrow-right"
          size={18}
        />
      </button>
      <nav
        className={styles.navigation}
        aria-label={t('profile.navigation')}
      >
        <Link
          className={styles.item}
          href="/#games"
          onClick={closeAllModals}
        >
          <span className={styles.label}>
            <Icon
              className={styles.glyph}
              name="gamepad-2"
              size={20}
            />
            {t('nav.games')}
          </span>
          <Icon
            className={styles.glyph}
            name="arrow-right"
            size={18}
          />
        </Link>
        <button
          type="button"
          className={styles.item}
          onClick={() => openModal('guide')}
        >
          <span className={styles.label}>
            <Icon
              className={styles.glyph}
              name="circle-question-mark"
              size={20}
            />
            {t('nav.guide')}
          </span>
          <Icon
            className={styles.glyph}
            name="arrow-right"
            size={18}
          />
        </button>
        <button
          type="button"
          className={styles.item}
          onClick={() => openModal('stats')}
        >
          <span className={styles.label}>
            <Icon
              className={styles.glyph}
              name="trophy"
              size={20}
            />
            {t('nav.stats')}
          </span>
          <Icon
            className={styles.glyph}
            name="arrow-right"
            size={18}
          />
        </button>
      </nav>
    </div>
  )
}

export default ProfileModal

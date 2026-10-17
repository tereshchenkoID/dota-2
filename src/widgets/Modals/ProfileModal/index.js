'use client'

import Image from 'next/image'

import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'
import { useProfileStore } from '@/store/profile'
import { useGameStore } from '@/modules/Dota/store/game'

import Badge from '@/components/Badge'
import Heading from '@/components/Heading'
import Icon from '@/components/Icon'
import Input from '@/components/Input'
import Panel from '@/components/Panel'
import Progress from '@/components/Progress'
import Text from '@/components/Text'
import { BALANCE } from '@/modules/Dota/config/balance'
import Metrics from '@/modules/Metrics'

import Action from './Action'

import styles from './index.module.scss'

const ProfileModal = () => {
  const { t, number } = useTranslation()
  const { username, avatar, setUsername } = useProfileStore()
  const { openModal, closeAllModals } = useModalStore()
  const progress = useGameStore((state) => state.progress)
  const earned = progress.xp % BALANCE.xpPerLevel

  return (
    <div className={styles.block}>
      <div className={styles.identity}>
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
          <span className={styles.edit}>
            <Icon
              name="image-plus"
              size={20}
            />
          </span>
        </button>
        <div className={styles.copy}>
          <Text
            size={3}
            color="muted"
          >
            {t('profile.player')}
          </Text>
          <Heading
            as="strong"
            size={3}
          >
            {username.trim() || 'Player'}
          </Heading>
        </div>
      </div>
      <Input
        label={t('profile.username')}
        value={username}
        maxLength={24}
        onChange={(event) => setUsername(event.target.value)}
        onBlur={() => { if (!username.trim()) setUsername('Player') }}
        autoComplete="nickname"
      />
      <Panel
        variant="raised"
        className={styles.copy}
      >
        <div className={styles.level}>
          <Heading
            as="h3"
            size={4}
          >
            {t('header.level', { level: number(progress.level) })}
          </Heading>
          <Badge color="accent">
            {t('header.experience')}
          </Badge>
        </div>
        <Progress
          value={earned}
          max={BALANCE.xpPerLevel}
          label={t('header.experience')}
        />
        <Text
          size={3}
          color="accent"
        >
          {number(earned)}
          {' '}
          /
          {' '}
          {number(BALANCE.xpPerLevel)}
          {' '}
          XP
        </Text>
        <Text
          size={3}
          color="muted"
        >
          {t('profile.nextLevel', { amount: number(BALANCE.xpPerLevel - earned) })}
        </Text>
        <Text
          size={3}
          color="muted"
        >
          {t('profile.totalXp', { amount: number(progress.xp) })}
        </Text>
      </Panel>
      <Metrics items={
        [
          { id: 'gold', label: t('header.gold'), value: number(progress.gold), icon: 'coins' },
          { id: 'wins', label: t('stats.wins'), value: number(progress.wins), icon: 'trophy' },
        ]
      }
      />
      <nav
        className={styles.navigation}
        aria-label={t('profile.navigation')}
      >
        <Action
          icon="settings"
          onClick={() => openModal('settings')}
        >
          {t('header.settings')}
        </Action>
        <Action
          icon="gamepad-2"
          href="/#games"
          onClick={closeAllModals}
        >
          {t('nav.games')}
        </Action>
        <Action
          icon="circle-question-mark"
          onClick={() => openModal('guide')}
        >
          {t('nav.guide')}
        </Action>
        <Action
          icon="trophy"
          onClick={() => openModal('stats')}
        >
          {t('nav.stats')}
        </Action>
      </nav>
    </div>
  )
}

export default ProfileModal

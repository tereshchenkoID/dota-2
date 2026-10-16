'use client'

import clsx from 'clsx'

import { useSound } from '@/hooks/useSound'
import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'
import { useGameStore } from '@/modules/Dota/store/game'

import Button from '@/components/Button'
import Icon from '@/components/Icon'
import Text from '@/components/Text'
import Toggle from '@/components/Toggle'
import Languages from '@/modules/Languages'

import styles from './index.module.scss'

const SettingsModal = () => {
  const { t } = useTranslation()
  const sound = useSound()
  const openModal = useModalStore((s) => s.openModal)
  const spinning = useGameStore((s) => s.spinning)

  return (
    <>
      <div className={clsx(styles.row, styles.group)}>
        <div className={styles.group}>
          <Text className={styles.label}>
            <Icon
              name="languages"
              size={20}
            />
            {t('header.language')}
          </Text>
          <Text
            size={3}
            color="muted"
          >
            {t('settings.languageHint')}
          </Text>
        </div>
        <Languages />
      </div>
      <div className={clsx(styles.row, styles.group)}>
        <div className={styles.group}>
          <Text className={styles.label}>
            <Icon
              name="volume-2"
              size={20}
            />
            {t('settings.sound')}
          </Text>
          <Text
            size={3}
            color="muted"
          >
            {t('settings.soundHint')}
          </Text>
        </div>
        <Toggle
          label={t('settings.sound')}
          checked={sound.enabled}
          onChange={sound.setEnabled}
          onLabel={t('settings.on')}
          offLabel={t('settings.off')}
        />
      </div>
      <Button
        color="danger"
        disabled={spinning}
        onClick={() => openModal('reset')}
      >
        {t('settings.reset')}
      </Button>
    </>
  )
}

export default SettingsModal

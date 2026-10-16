'use client'

import { useSound } from '@/hooks/useSound'
import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'
import { useGameStore } from '@/modules/Dota/store/game'

import Button from '@/components/Button'
import Toggle from '@/components/Toggle'
import Languages from '@/modules/Languages'

import Row from './Row'
import Theme from './Theme'

import styles from './index.module.scss'

const SettingsModal = () => {
  const { t } = useTranslation()
  const sound = useSound()
  const openModal = useModalStore((state) => state.openModal)
  const spinning = useGameStore((state) => state.spinning)

  return (
    <div className={styles.block}>
      <Row
        icon="sun-moon"
        label={t('appearance.title')}
        description={t('appearance.description')}
      >
        <Theme />
      </Row>
      <Row
        icon="languages"
        label={t('header.language')}
        description={t('settings.languageHint')}
      >
        <Languages />
      </Row>
      <Row
        icon="volume-2"
        label={t('settings.sound')}
        description={t('settings.soundHint')}
      >
        <Toggle
          label={t('settings.sound')}
          checked={sound.enabled}
          onChange={sound.setEnabled}
          onLabel={t('settings.on')}
          offLabel={t('settings.off')}
        />
      </Row>
      <Button
        color="danger"
        disabled={spinning}
        onClick={() => openModal('reset')}
      >
        {t('settings.reset')}
      </Button>
    </div>
  )
}

export default SettingsModal

'use client'
import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'
import { useGameStore } from '@/modules/Dota/store/game'

import Button from '@/components/Button'
import Text from '@/components/Text'

import styles from './index.module.scss'
const ConfirmModal = ({ action, onClose }) => {
  const { t } = useTranslation()
  const { spinning, newRun, reset } = useGameStore()
  const closeAll = useModalStore((s) => s.closeAllModals)
  return (
    <>
      <Text color="muted">
        {t(action === 'reset' ? 'settings.resetBody' : 'game.restartBody')}
      </Text>
      <div className={styles.actions}>
        <Button
          color="secondary"
          onClick={onClose}
        >
          {t('game.cancel')}
        </Button>
        <Button
          color={action === 'reset' ? 'danger' : 'primary'}
          disabled={spinning}
          onClick={
            () => {
              if (action === 'reset') reset()
              else newRun()
              closeAll()
            }
          }
        >
          {t('game.confirm')}
        </Button>
      </div>
    </>
  )
}

export default ConfirmModal

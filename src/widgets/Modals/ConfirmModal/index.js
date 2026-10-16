'use client'
import { useTranslation } from '@/hooks/useTranslation'
import { useModalStore } from '@/store/modal'
import { useArcadeStore } from '@/modules/Dota/store/arcade'
import { useGameStore } from '@/modules/Dota/store/game'

import Button from '@/components/Button'
import Text from '@/components/Text'

import styles from './index.module.scss'
const ConfirmModal = ({ action, onClose }) => {
  const { t } = useTranslation()
  const { spinning, newRun, reset } = useGameStore()
  const arcade = useArcadeStore()
  const closeAll = useModalStore((s) => s.closeAllModals)
  return (
    <>
      <Text color="muted">
        {t(action === 'reset' ? 'settings.resetBody' : action === 'arcade-restart' ? 'gauntlet.restartBody' : 'game.restartBody')}
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
          disabled={spinning || arcade.spinning}
          onClick={
            () => {
              if (action === 'reset') {
                reset()
                arcade.reset()
              } else if (action === 'arcade-restart') arcade.newRun()
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

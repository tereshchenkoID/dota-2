import { useTranslation } from '@/hooks/useTranslation'

import styles from './index.module.scss'
const SpinButton = ({ onClick, disabled, spinning }) => {
  const { t } = useTranslation()
  return (
    <button
      type="button"
      className={styles.spinButton}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={styles.buttonLabel}>
        {t(spinning ? 'game.spinning' : 'game.spin')}
      </span>
    </button>
  )
}

export default SpinButton

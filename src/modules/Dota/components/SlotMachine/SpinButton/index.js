import { useTranslation } from '@/hooks/useTranslation'

import GameButton from '@/modules/Dota/components/GameButton'

const SpinButton = ({ onClick, disabled, spinning }) => {
  const { t } = useTranslation()

  return (
    <GameButton
      fullWidth
      size="large"
      disabled={disabled}
      onClick={onClick}
    >
      {t(spinning ? 'game.spinning' : 'game.spin')}
    </GameButton>
  )
}

export default SpinButton

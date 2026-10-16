'use client'

import { useTranslation } from '@/hooks/useTranslation'

import Text from '@/components/Text'
import GameGuide from '@/modules/Dota/components/GameGuide'

const ArcadeGuide = () => {
  const { t } = useTranslation()
  return (
    <>
      <Text>
        {t('gauntlet.description')}
      </Text>
      <Text color="muted">
        {t('gauntlet.rules')}
      </Text>
      <Text color="muted">
        {t('gauntlet.runeHint')}
      </Text>
      <GameGuide />
    </>
  )
}

export default ArcadeGuide

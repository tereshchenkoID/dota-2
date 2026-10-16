'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { useAppearanceStore } from '@/store/appearance'

import Select from '@/components/Select'

import { THEMES } from '@/lib/theme'

const Theme = () => {
  const { t } = useTranslation()
  const { theme, setTheme } = useAppearanceStore()

  return (
    <Select
      label={t('appearance.title')}
      value={theme}
      onChange={setTheme}
      options={THEMES.map((value) => ({ value, label: t(`appearance.${value}`) }))}
    />
  )
}

export default Theme

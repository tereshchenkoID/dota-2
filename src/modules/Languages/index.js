'use client'

import { LANGUAGES } from '@/i18n/config'

import { useChangeLanguage } from '@/hooks/useChangeLanguage'
import { useTranslation } from '@/hooks/useTranslation'

import Select from '@/components/Select'

const LANGUAGE_OPTIONS = Object.entries(LANGUAGES).map(([value, option]) => ({
  value,
  label: option.label,
  short: option.short,
}))

const Languages = () => {
  const { t, language } = useTranslation()
  const changeLanguage = useChangeLanguage()

  return (
    <Select
      label={t('header.language')}
      value={language}
      onChange={changeLanguage}
      options={LANGUAGE_OPTIONS}
    />
  )
}

export default Languages

'use client'

import { useMemo } from 'react'
import { useFormatter, useLocale, useTranslations } from 'next-intl'

export const useTranslation = () => {
  const language = useLocale()
  const t = useTranslations()
  const formatter = useFormatter()

  return useMemo(() => ({
    language,
    t,
    number: (value) => formatter.number(value),
    date: (value) => formatter.dateTime(new Date(value), { dateStyle: 'medium', timeStyle: 'short' }),
  }), [language, t, formatter])
}

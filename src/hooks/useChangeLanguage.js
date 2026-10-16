'use client'

import { useCallback } from 'react'
import { useLocale } from 'next-intl'

import { resolveLanguage } from '@/i18n/config'
import { getPathname, usePathname } from '@/i18n/navigation'

export const useChangeLanguage = () => {
  const language = useLocale()
  const pathname = usePathname()

  return useCallback((value) => {
    const locale = resolveLanguage(value)
    if (locale === language) return
    const url = new URL(window.location.href)
    url.pathname = getPathname({ locale, href: pathname })
    window.location.assign(url.href)
  }, [language, pathname])
}

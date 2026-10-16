import { hasLocale } from 'next-intl'

import { ROUTING } from '@/i18n/routing'

export const LANGUAGES = {
  en: { label: 'English', short: 'EN' },
  ru: { label: 'Русский', short: 'RU' },
  uk: { label: 'Українська', short: 'UK' },
}
export const DEFAULT_LANGUAGE = ROUTING.defaultLocale

export const isLanguage = (value) => hasLocale(ROUTING.locales, value)

export const resolveLanguage = (value) => {
  const locale = String(value || '').trim().toLowerCase()
  return isLanguage(locale) ? locale : DEFAULT_LANGUAGE
}

import { getRequestConfig } from 'next-intl/server'

import { resolveLanguage } from '@/i18n/config'

const LOAD_MESSAGES = {
  en: () => import('./locales/en.json'),
  ru: () => import('./locales/ru.json'),
  uk: () => import('./locales/uk.json'),
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = resolveLanguage(await requestLocale)
  const { default: messages } = await LOAD_MESSAGES[locale]()

  return {
    locale,
    messages,
    timeZone: 'Europe/Bucharest',
  }
})

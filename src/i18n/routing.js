import { defineRouting } from 'next-intl/routing'

export const ROUTING = defineRouting({
  locales: ['en', 'ru', 'uk'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: false,
  localeCookie: false,
})

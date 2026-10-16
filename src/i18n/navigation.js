import { createNavigation } from 'next-intl/navigation'

import { isLanguage } from '@/i18n/config'
import { ROUTING } from '@/i18n/routing'

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(ROUTING)

export const isExternalHref = (href) =>
  typeof href === 'string' && /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)

export const stripLanguage = (pathname) => {
  const path = pathname || '/'
  const first = path.split('/')[1]
  return isLanguage(first) ? path.slice(first.length + 1) || '/' : path
}

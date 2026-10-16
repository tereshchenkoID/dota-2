import { NextResponse } from 'next/server'
import { hasLocale } from 'next-intl'
import createMiddleware from 'next-intl/middleware'

import { ROUTING } from '@/i18n/routing'

const HANDLE_I18N_ROUTING = createMiddleware(ROUTING)
const LOCALE_SEGMENT = /^[a-z]{2}(?:-[a-z]{2})?$/i

export const proxy = (request) => {
  const segments = request.nextUrl.pathname.split('/')
  const first = segments[1]

  if (first && LOCALE_SEGMENT.test(first) && !hasLocale(ROUTING.locales, first)) {
    const normalized = first.toLowerCase()
    segments[1] = hasLocale(ROUTING.locales, normalized) ? normalized : ROUTING.defaultLocale
    const url = request.nextUrl.clone()
    url.pathname = segments.join('/')
    return NextResponse.redirect(url)
  }

  return HANDLE_I18N_ROUTING(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|assets|.*\\..*).*)'],
}

import { Cinzel, Inter, Roboto_Condensed } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import clsx from 'clsx'

import { isLanguage } from '@/i18n/config'
import { ROUTING } from '@/i18n/routing'

import StoreHydration from '@/modules/StoreHydration'
import Footer from '@/widgets/Footer'
import Header from '@/widgets/Header'
import Modals from '@/widgets/Modals'

import './layout.scss'

const INTER = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const ROBOTO_CONDENSED = Roboto_Condensed({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-game',
  display: 'swap',
})

const CINZEL = Cinzel({
  subsets: ['latin'],
  variable: '--font-game-display',
  display: 'swap',
})

export const metadata = {
  title: 'Spin Arcade — Browser Adventures',
  description:
    'Free browser adventures. Choose a slot, summon your heroes, and build your legacy.',
}

export const dynamicParams = false

export const generateStaticParams = () =>
  ROUTING.locales.map((locale) => ({ locale }))

const LocaleLayout = async ({ children, params }) => {
  const { locale } = await params
  if (!isLanguage(locale)) notFound()
  const messages = await getMessages({ locale })
  return (
    <html
      lang={locale}
      className={
        clsx(
          INTER.variable,
          ROBOTO_CONDENSED.variable,
          CINZEL.variable
        )
      }
    >
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
        >
          <StoreHydration />
          <Header />
          <main>
            {children}
          </main>
          <Footer />
          <Modals />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default LocaleLayout

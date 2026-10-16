import createNextIntlPlugin from 'next-intl/plugin'

const WITH_NEXT_INTL = createNextIntlPlugin('./src/i18n/request.js')

const nextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,

  sassOptions: {
    additionalData: `
      @use "@/scss/config" as *;
    `,
  },
}

export default WITH_NEXT_INTL(nextConfig)

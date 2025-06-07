import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import NextTopLoader from 'nextjs-toploader'

import { Clarity, GoogleAnalytics, Umami } from '@/components/analytics'
import { TailwindIndicator } from '@/components/blocks/tailwind-indicator'
import { ThemeProvider } from '@/components/theme'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { siteConfig } from '@/config'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { caveat, notoSans } from '@/style/font'

import type { Metadata } from 'next'

import '@/style/globals.css'
import '@/styles/select-fixes.css'

export const metadata: Metadata = {
  title: 'Dish Comment AI',
  description: 'To free food needs to be reviewed? Use me to generate it',
  keywords: [
    'Dish Comment AI',
    'Dish Comment',
    'Dish Comment Generator',
    '点评',
    '评价生成器',
    '大众点评',
  ],
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(notoSans.variable, caveat.variable, 'antialiased')}
        style={{
          fontFamily: 'var(--font-noto-sans)',
        }}
      >
        <NextIntlClientProvider>
          <NextTopLoader
            color={siteConfig.topLoaderColor}
            zIndex={51}
            showSpinner={false}
            showForHashAnchor={false}
          />
          <ThemeProvider>
            <TooltipProvider>
              {children}
              <Toaster richColors />
            </TooltipProvider>
          </ThemeProvider>
          <TailwindIndicator />
        </NextIntlClientProvider>

        {/* Analytics */}
        <GoogleAnalytics />
        <Umami />
        <Clarity />
      </body>
    </html>
  )
}

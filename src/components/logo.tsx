import Link from 'next/link'
import { useLocale } from 'next-intl'

import Icon from './icon'

export const Logo = () => {
  const locale = useLocale()
  return (
    <Link
      aria-label="home"
      className="text-primary flex items-center gap-2 text-2xl whitespace-nowrap lg:mx-4"
      href="/"
    >
      <Icon className="h-8 w-8" />
      {locale === 'zh' ? '餐厅点评 AI' : 'Dish Comment AI'}
    </Link>
  )
}

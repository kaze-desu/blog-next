'use client'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { cn } from '@/utilities/ui'
import { SearchIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {
  data: HeaderType
  className?: string
}

export const EnscribeHeaderClient: React.FC<Props> = ({ data, className }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const navItems = data?.navItems || []

  return (
    <header className={cn('w-full', className)} {...(theme ? { 'data-theme': theme } : {})}>
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <Link className="flex shrink-0 items-center" href="/">
          <span className="sr-only">Home</span>
          <Image alt="Logo" height={24} priority src="/static/enscribe-logo.svg" width={24} />
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {navItems.map(({ link }, i) => {
            return (
              <CMSLink
                className="capitalize text-foreground/60 transition-colors hover:text-foreground/80"
                key={i}
                {...link}
              />
            )
          })}

          <Link
            className="text-foreground/60 transition-colors hover:text-foreground/80"
            href="/search"
          >
            <span className="sr-only">Search</span>
            <SearchIcon className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  )
}



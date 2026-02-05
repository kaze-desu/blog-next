import type { Footer as FooterType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

export async function EnscribeFooter() {
  const footerData: FooterType = await getCachedGlobal('footer', 1)()
  const navItems = footerData?.navItems || []
  const year = new Date().getFullYear()

  return (
    <footer className="py-4">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-y-2 px-4 sm:flex-row sm:justify-between">
        <span className="text-muted-foreground text-sm">&copy; {year} 由KAZE桑维护中~</span>

        <div className="flex items-center gap-4">
          <ThemeSelector />
          <nav className="flex items-center gap-4 text-sm">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  className="text-foreground/60 transition-colors hover:text-foreground/80"
                  key={i}
                  {...link}
                />
              )
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}



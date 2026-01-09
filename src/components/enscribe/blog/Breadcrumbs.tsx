import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export type BreadcrumbItem = {
  href?: string
  label: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-muted-foreground">
        <li>
          <Link aria-label="Home" className="inline-flex items-center" href="/">
            <Home className="h-4 w-4" />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <li aria-hidden="true">
                <ChevronRight className="h-4 w-4 opacity-70" />
              </li>
              <li className={isLast ? 'text-foreground' : undefined}>
                {isLast || !item.href ? (
                  <span className="line-clamp-1">{item.label}</span>
                ) : (
                  <Link className="underline decoration-transparent underline-offset-[3px] hover:decoration-inherit" href={item.href}>
                    <span className="line-clamp-1">{item.label}</span>
                  </Link>
                )}
              </li>
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}



import React from 'react'

import type { HomeLayoutBlock as HomeLayoutBlockProps } from '@/payload-types'

import Link from 'next/link'
import { Media } from '@/components/Media'

const fallbackIntro = {
  eyebrow: '',
  titlePrefix: '',
  titleHighlight: '',
  titleSuffix: '',
  description: '',
}

const fallbackFriends = {
  title: '',
  description: '',
  links: [],
}

export const HomeLayoutBlock: React.FC<HomeLayoutBlockProps> = ({ intro, friends }) => {
  const resolvedIntro = {
    ...fallbackIntro,
    ...intro,
  }

  const resolvedFriends = {
    ...fallbackFriends,
    ...friends,
  }

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        {resolvedIntro.eyebrow && (
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
            {resolvedIntro.eyebrow}
          </p>
        )}
        {(resolvedIntro.titlePrefix || resolvedIntro.titleHighlight || resolvedIntro.titleSuffix) && (
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {resolvedIntro.titlePrefix && <span>{resolvedIntro.titlePrefix} </span>}
            {resolvedIntro.titleHighlight && (
              <span className="text-primary">{resolvedIntro.titleHighlight}</span>
            )}
            {resolvedIntro.titleSuffix && <span> {resolvedIntro.titleSuffix}</span>}
          </h1>
        )}
        {resolvedIntro.description && (
          <p className="text-base text-pretty text-muted-foreground sm:text-lg">
            {resolvedIntro.description}
          </p>
        )}
      </header>

      {(resolvedFriends.title || resolvedFriends.description || resolvedFriends.links?.length) && (
        <div className="rounded-2xl border bg-muted/30 p-5 sm:p-6">
          {resolvedFriends.title && <h3 className="text-lg font-semibold">{resolvedFriends.title}</h3>}
          {resolvedFriends.description && (
            <p className="mt-2 text-sm text-muted-foreground">{resolvedFriends.description}</p>
          )}
          {resolvedFriends.links?.length ? (
            <ul className="mt-4 flex flex-wrap items-start gap-3">
              {resolvedFriends.links.map((link, index) => {
                const hasAvatar = link.avatar && typeof link.avatar === 'object'
                return (
                  <li key={`${link.name}-${index}`} className="w-fit">
                    <Link
                      className="flex w-fit items-center gap-3 rounded-xl border bg-background/60 px-4 py-3 text-sm transition-colors hover:bg-muted"
                      href={link.url}
                      rel={link.newTab ? 'noopener noreferrer' : undefined}
                      target={link.newTab ? '_blank' : undefined}
                    >
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border bg-muted">
                        {hasAvatar ? (
                          <Media
                            imgClassName="h-10 w-10 object-cover"
                            resource={link.avatar}
                            size="40px"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {(link.name || '').slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-foreground">{link.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
      )}
    </div>
  )
}

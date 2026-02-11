import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import type { HomeLayoutBlock, Post } from '@/payload-types'
import { MoveUpRight } from 'lucide-react'
import { PageAnimation } from '@/components/PageAnimation'

import PageTemplate, { generateMetadata as generateTemplateMetadata } from './[slug]/page'

export const revalidate = 600

const fallbackIntro = {
  eyebrow: '静かな森 - 致虚极，守静笃。',
  titlePrefix: "Hi, I'm",
  titleHighlight: 'enscribe',
  titleSuffix: '',
  description:
    'A NodeJS full-stack Developer who writes about building with Payload, Next.js, and modern UI.',
}

const fallbackFriends = {
  title: 'Friends Links',
  description: 'No friends yet...',
  links: [],
}

export default async function HomePage() {
  // Allow keeping old homepage when not migrating
  if ((process.env.FRONTEND_SHELL || 'template') !== 'enscribe') {
    return <PageTemplate params={Promise.resolve({ slug: 'home' })} />
  }

  const payload = await getPayload({ config: configPromise })

  const latestPosts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 6,
    overrideAccess: false,
    sort: '-publishedAt',
    select: {
      title: true,
      slug: true,
      meta: true,
      publishedAt: true,
    },
  })

  const homePage = await payload.find({
    collection: 'pages',
    limit: 1,
    pagination: false,
    overrideAccess: false,
    where: {
      slug: {
        equals: 'home',
      },
    },
    select: {
      layout: true,
    },
  })

  const homeLayoutBlock = homePage.docs?.[0]?.layout?.find(
    (block): block is HomeLayoutBlock => block.blockType === 'homeLayout',
  )

  const intro = {
    ...fallbackIntro,
    ...homeLayoutBlock?.intro,
  }

  const friends = {
    ...fallbackFriends,
    ...homeLayoutBlock?.friends,
  }

  const latestPostDocs = (latestPosts.docs ?? []) as Array<
    Pick<Post, 'slug' | 'title' | 'meta' | 'publishedAt'>
  >

  const [featuredPost, ...morePosts] = latestPostDocs

  const featuredPostHref = featuredPost?.slug ? `/posts/${featuredPost.slug}` : null
  const featuredPostImage = featuredPost?.meta?.image
  const featuredPostTitle = featuredPost?.title || featuredPost?.meta?.title

  const formatPublishedAt = (publishedAt?: string | null) => {
    if (!publishedAt) return null
    const date = new Date(publishedAt)
    if (Number.isNaN(date.getTime())) return null
    return new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium' }).format(date)
  }

  return (
    <section className={cn('mx-auto flex max-w-3xl flex-col gap-12 px-4 py-12 sm:py-16')}>
      <PageAnimation>
        <header className="space-y-4">
          {intro.eyebrow && (
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {intro.eyebrow}
            </p>
          )}
          {(intro.titlePrefix || intro.titleHighlight || intro.titleSuffix) && (
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {intro.titlePrefix && <span>{intro.titlePrefix} </span>}
              {intro.titleHighlight && <span className="text-primary">{intro.titleHighlight}</span>}
              {intro.titleSuffix && <span> {intro.titleSuffix}</span>}
            </h1>
          )}
          {intro.description && (
            <p className="text-base text-pretty text-muted-foreground sm:text-lg">
              {intro.description}
            </p>
          )}
        </header>
      </PageAnimation>

      <PageAnimation delay={0.1}>
        {featuredPostHref ? (
          <Link
            aria-label={featuredPostTitle ? `Read latest post: ${featuredPostTitle}` : 'Read latest post'}
            className="block rounded-2xl border bg-card p-5 transition-colors hover:bg-muted sm:p-6"
            href={featuredPostHref}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  Latest Post
                </p>
                <h2 className="text-2xl font-semibold">
                  {featuredPostTitle || 'No posts yet.'}
                </h2>
                {featuredPost?.publishedAt && (
                  <p className="text-xs text-muted-foreground">
                    {formatPublishedAt(featuredPost.publishedAt)}
                  </p>
                )}
              </div>
              <span className="flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium text-foreground">
                Read
                <MoveUpRight className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-5 overflow-hidden rounded-xl border bg-muted">
              {featuredPostImage && typeof featuredPostImage !== 'string' ? (
                <div className="relative h-48 sm:h-56">
                  <Media fill imgClassName="object-cover" resource={featuredPostImage} />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  No featured image
                </div>
              )}
            </div>
          </Link>
        ) : (
          <div className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  Latest Post
                </p>
                <h2 className="text-2xl font-semibold">No posts yet.</h2>
              </div>
            </div>
            <div className="mt-5 overflow-hidden rounded-xl border bg-muted">
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                No featured image
              </div>
            </div>
          </div>
        )}
      </PageAnimation>

      <PageAnimation delay={0.2}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Posts</h3>
            <Link className="text-sm text-muted-foreground transition hover:text-foreground" href="/posts">
              View all
            </Link>
          </div>
          {morePosts.length > 0 ? (
            <div className="space-y-3">
              {morePosts.map((post) => {
                const href = post.slug ? `/posts/${post.slug}` : '#'
                const title = post.title || post.meta?.title || 'Untitled'
                const publishedAt = formatPublishedAt(post.publishedAt)
                return (
                  <Link
                    key={post.slug ?? title}
                    className="flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm transition-colors hover:bg-muted"
                    href={href}
                  >
                    <span className="text-foreground">{title}</span>
                    {publishedAt && <span className="text-xs text-muted-foreground">{publishedAt}</span>}
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl border px-4 py-6 text-sm text-muted-foreground">
              No posts yet. Check back soon.
            </div>
          )}
        </div>
      </PageAnimation>

      <PageAnimation delay={0.3}>
        {(friends.title || friends.description || friends.links?.length) && (
          <div className="rounded-2xl border bg-muted/30 p-5 sm:p-6">
            {friends.title && <h3 className="text-lg font-semibold">{friends.title}</h3>}
            {friends.description && (
              <p className="mt-2 text-sm text-muted-foreground">{friends.description}</p>
            )}
            {friends.links?.length ? (
              <ul className="mt-4 flex flex-wrap items-start gap-3">
                {friends.links.map((link, index) => {
                  const hasAvatar = link.avatar && typeof link.avatar === 'object'
                  return (
                    <li key={`${link.name}-${index}`} className="w-fit">
                      <Link
                        className="flex w-fit items-center gap-3 rounded-xl border bg-background/60 px-4 py-3 text-sm transition-colors hover:bg-muted"
                        href={link.url}
                        rel={link.newTab ? 'noreferrer' : undefined}
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
      </PageAnimation>
    </section>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  if ((process.env.FRONTEND_SHELL || 'template') !== 'enscribe') {
    return generateTemplateMetadata({ params: Promise.resolve({ slug: 'home' }) })
  }

  return {
    title: 'Home',
  }
}

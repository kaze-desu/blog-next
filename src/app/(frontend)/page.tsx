import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'
import { MoveUpRight } from 'lucide-react'

import PageTemplate, { generateMetadata as generateTemplateMetadata } from './[slug]/page'

export const revalidate = 600

export default async function HomePage() {
  // Allow keeping old homepage when not migrating
  if ((process.env.FRONTEND_SHELL || 'template') !== 'enscribe') {
    return <PageTemplate params={Promise.resolve({ slug: 'home' })} />
  }

  const payload = await getPayload({ config: configPromise })

  const latestPosts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    sort: '-publishedAt',
    select: {
      title: true,
      slug: true,
      meta: true,
    },
  })

  const latestPost = (latestPosts.docs?.[0] ?? null) as Pick<Post, 'slug' | 'title' | 'meta'> | null

  const latestPostHref = latestPost?.slug ? `/posts/${latestPost.slug}` : null
  const latestPostImage = latestPost?.meta?.image
  const latestPostTitle = latestPost?.title || latestPost?.meta?.title

  return (
    <section
      className={cn(
        'mx-auto grid max-w-sm grid-cols-1 px-2',
        '[grid-template-areas:"a""b""e""c"]',
        'sm:max-w-2xl sm:grid-cols-2 sm:[grid-template-areas:"a_a""b_c""e_e"]',
        'lg:max-w-5xl lg:grid-cols-3 lg:[grid-template-areas:"a_a_b""c_e_e"]',
        'xl:max-w-7xl xl:grid-cols-4 xl:[grid-template-areas:"a_a_b_c""e_e_e_e"]',
      )}
    >
      {/* About */}
      <div className="aspect-[3/4] p-2 [grid-area:a] sm:aspect-[2/1] xl:aspect-[2/1]">
        <div className="size-full border bg-muted">
          <div className="size-full bg-[url('/static/bento/about-background-square.png')] bg-cover bg-center bg-no-repeat sm:bg-[url('/static/bento/about-background.png')]">
            <div className="size-full bg-[url('/static/bento/about-foreground-square.png')] bg-cover bg-center bg-no-repeat transition-opacity duration-200 sm:bg-[url('/static/bento/about-foreground.png')]">
              <div className="flex p-4">
                <div className="hidden w-1/3 sm:block" />
                <div className="space-y-4 sm:w-2/3">
                  <p className="block border bg-background p-3 text-sm text-pretty text-foreground/80">
                    Hey, I&rsquo;m <b>enscribe</b>! This is our new homepage shell powered by Payload
                    CMS.
                  </p>
                  <p className="block border bg-background p-3 text-sm text-pretty text-foreground/80">
                    我们会逐步把旧模板替换为 Enscribe 风格（Next.js + React 渲染），内容依然从 Payload
                    获取。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="aspect-square p-2 [grid-area:b]">
        <div className="size-full border bg-muted">
          <div className="size-full bg-[url('/static/bento/details-background.png')] bg-cover bg-center bg-no-repeat">
            <div className="relative size-full bg-[url('/static/bento/details-foreground.png')] bg-cover bg-center bg-no-repeat transition-opacity duration-200 sm:opacity-0 sm:hover:opacity-100">
              <p className="absolute top-1/2 left-0 ml-4 mr-24 -translate-y-1/2 border bg-background p-3 text-xs text-pretty text-foreground/80">
                这是一个从 Payload Website Template 迁移到 Enscribe UI 的过程。接下来会替换 Posts
                列表与详情页。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="aspect-square p-2 [grid-area:c] sm:aspect-[1/2] lg:aspect-square xl:aspect-[1/2]">
        <div className="size-full border bg-muted">
          <div className="size-full bg-[url('/static/bento/image-1.png')] bg-cover bg-center bg-no-repeat" />
        </div>
      </div>

      {/* Latest post */}
      <div className="aspect-[6/5] p-2 [grid-area:e] sm:aspect-[2/1]">
        <div className="size-full border bg-muted">
          <div className="relative size-full bg-[url('/static/bento/blog-background-square.png')] bg-cover bg-center bg-no-repeat sm:bg-[url('/static/bento/blog-background.png')]">
            <div className="absolute size-full bg-[url('/static/bento/blog-foreground-square.png')] bg-cover bg-center bg-no-repeat transition-opacity duration-200 sm:bg-[url('/static/bento/blog-foreground.png')] sm:opacity-0 sm:hover:opacity-100">
              <p className="absolute bottom-4 left-16 border bg-background p-2 text-xs text-pretty text-foreground/80 sm:top-[42.5%] sm:right-4 sm:bottom-[inherit] sm:left-[inherit] sm:-translate-y-1/2">
                Read our latest <br /> post!
              </p>
            </div>

            <div className="p-3 sm:size-full sm:p-6">
              {latestPost && latestPostHref ? (
                <Link className="flex h-full" href={latestPostHref}>
                  <div className="relative h-full w-full overflow-hidden border">
                    {latestPostImage && typeof latestPostImage !== 'string' ? (
                      <Media fill imgClassName="object-cover" resource={latestPostImage} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-4 text-sm text-muted-foreground">
                        No featured image
                      </div>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="flex h-full items-center justify-center p-6 text-sm text-muted-foreground">
                  No posts yet.
                </div>
              )}
            </div>

            {latestPost && latestPostHref && (
              <Link
                aria-label={latestPostTitle ? `Read latest post: ${latestPostTitle}` : 'Read latest post'}
                className="absolute bottom-0 end-0 m-3 rounded-full bg-border/50 p-3 text-primary transition-[box-shadow] duration-300 hover:ring-2 hover:ring-ring focus-visible:ring-2 focus-visible:ring-ring"
                href={latestPostHref}
                title={latestPostTitle ? `Read latest post: ${latestPostTitle}` : 'Read latest post'}
              >
                <MoveUpRight className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
              </Link>
            )}
          </div>
        </div>
      </div>
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

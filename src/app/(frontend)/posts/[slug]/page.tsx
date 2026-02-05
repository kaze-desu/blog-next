import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { Breadcrumbs } from '@/components/enscribe/blog/Breadcrumbs'
import { CategoryBadge } from '@/components/enscribe/blog/CategoryBadge'
import { PostNavigation } from '@/components/enscribe/blog/PostNavigation'
import { PostWithTOC } from '@/components/enscribe/blog/PostWithTOC.client'
import { Media } from '@/components/Media'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { RichTextWithLightbox } from '@/components/Lightbox/RichTextWithLightbox.client'
import { PageAnimation } from '@/components/PageAnimation'
import { ReadingProgress } from '@/components/ReadingProgress/ReadingProgress.client'
import { Tag, Bookmark } from 'lucide-react'

import type { Post } from '@/payload-types'

import { formatAuthors } from '@/utilities/formatAuthors'
import { formatDateTime } from '@/utilities/formatDateTime'
import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import { readingTimeFromLexical } from '@/utilities/readingTime'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  // Old template mode
  if ((process.env.FRONTEND_SHELL || 'template') !== 'enscribe') {
    return (
      <article className="pt-16 pb-16">
        <PageClient />

        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound url={url} />

        {draft && <LivePreviewListener />}

        {/* Reuse existing template hero + body */}
        <PageAnimation>
          <PostHero post={post} />
        </PageAnimation>

        <PageAnimation>
          <div className="flex flex-col items-center gap-4 pt-8">
            <div className="container">
              <RichTextWithLightbox
                className="max-w-[48rem] mx-auto"
                data={post.content}
                enableGutter={false}
              />
              {/* RelatedPosts intentionally omitted in enscribe mode; keep in template mode */}
              {post.relatedPosts && post.relatedPosts.length > 0 && (
                <RelatedPosts
                  className="lg:container mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
                  docs={post.relatedPosts.filter((p) => typeof p === 'object')}
                />
              )}
            </div>
          </div>
        </PageAnimation>

        <ReadingProgress />
      </article>
    )
  }

  const breadcrumbs = [{ href: '/posts', label: 'Posts' }, { label: post.title }]

  const heroMedia = post.heroImage && typeof post.heroImage !== 'string' ? post.heroImage : null
  const metaMedia =
    post?.meta?.image && typeof post.meta.image !== 'string' ? post.meta.image : null
  const cover = heroMedia || metaMedia

  const authorLabel =
    post.populatedAuthors && post.populatedAuthors.length > 0
      ? formatAuthors(post.populatedAuthors)
      : ''
  const dateValue = post.publishedAt || post.createdAt
  const dateLabel = dateValue ? formatDateTime(String(dateValue)) : ''
  const readTime = readingTimeFromLexical(post.content)

  const categoryLabels =
    Array.isArray(post.categories) && post.categories.length > 0
      ? post.categories
          .map((category) =>
            typeof category === 'object' && category && 'title' in category
              ? (category as { title?: unknown }).title
              : null,
          )
          .filter((t): t is string => typeof t === 'string' && t.length > 0)
      : []

  const tagLabels =
    Array.isArray(post.tags) && post.tags.length > 0
      ? post.tags
          .map((tag) =>
            typeof tag === 'object' && tag && 'title' in tag
              ? (tag as { title?: unknown }).title
              : null,
          )
          .filter((t): t is string => typeof t === 'string' && t.length > 0)
      : []

  const relatedPosts =
    Array.isArray(post.relatedPosts) && post.relatedPosts.length > 0
      ? post.relatedPosts.filter((item): item is Post => typeof item === 'object' && item !== null)
      : []

  const { olderPost, newerPost } = await queryAdjacentPosts({ current: post })

  return (
    <article className="py-10">
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <div className="mx-auto w-full max-w-5xl px-4">
        <PostWithTOC>
          <section className="mx-auto w-full max-w-3xl">
            <Breadcrumbs items={breadcrumbs} />

            {cover ? (
              <PageAnimation>
                <div className="mx-auto mt-6 w-full max-w-5xl">
                  <div className="relative aspect-[1200/630] w-full overflow-hidden border">
                    <Media
                      fill
                      imgClassName="object-cover"
                      pictureClassName="absolute inset-0"
                      resource={cover}
                    />
                  </div>
                </div>
              </PageAnimation>
            ) : null}

            <PageAnimation>
              <section className="mt-6 flex flex-col gap-y-6 text-center">
                <div className="flex flex-col">
                  <h1
                    className="mb-2 scroll-mt-24 text-3xl font-medium leading-tight sm:text-4xl"
                    id="post-title"
                  >
                    {post.title}
                  </h1>

                  <div className="divide-border mb-4 flex flex-col items-center justify-center divide-y text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:divide-x sm:divide-y-0 sm:text-sm">
                    {authorLabel ? (
                      <div className="flex w-full items-center justify-center gap-x-2 py-2 sm:w-fit sm:px-2 sm:py-0 first:sm:pl-0 last:sm:pr-0">
                        <span className="text-foreground">{authorLabel}</span>
                      </div>
                    ) : null}

                    {dateLabel ? (
                      <div className="flex w-full items-center justify-center gap-2 py-2 sm:w-fit sm:px-2 sm:py-0 first:sm:pl-0 last:sm:pr-0">
                        <span>{dateLabel}</span>
                      </div>
                    ) : null}

                    <div className="flex w-full items-center justify-center gap-2 py-2 sm:w-fit sm:px-2 sm:py-0 first:sm:pl-0 last:sm:pr-0">
                      <span>{readTime}</span>
                    </div>

                    {categoryLabels.length > 0 ? (
                      <div className="flex w-full flex-wrap items-center justify-center gap-2 py-2 sm:w-fit sm:px-2 sm:py-0 first:sm:pl-0 last:sm:pr-0">
                        {categoryLabels.map((label) => (
                          <span key={label} className="inline-flex items-center gap-1">
                            <Bookmark className="h-3 w-3" />
                            <span>{label}</span>
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                {relatedPosts.length > 0 ? (
                  <RelatedPosts className="mt-2 w-full" docs={relatedPosts} />
                ) : null}
              </section>
            </PageAnimation>

            <PageAnimation>
              <div className="mt-6">
                <RichTextWithLightbox
                  className="max-w-none"
                  data={post.content}
                  enableGutter={false}
                />
              </div>
            </PageAnimation>

            {tagLabels.length > 0 ? (
              <PageAnimation>
                <div className="mt-8 flex flex-wrap items-center justify-start gap-2 text-sm">
                  <span className="inline-flex items-center text-muted-foreground">
                    <Tag className="h-4 w-4" />
                  </span>
                  {tagLabels.map((label) => (
                    <CategoryBadge key={label} label={label} showIcon={false} />
                  ))}
                </div>
              </PageAnimation>
            ) : null}

            <PageAnimation>
              <div className="mt-6">
                <PostNavigation newerPost={newerPost} olderPost={olderPost} />
              </div>
            </PageAnimation>
          </section>
        </PostWithTOC>
      </div>

      <ReadingProgress />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const queryAdjacentPosts = cache(async ({ current }: { current: Post }) => {
  const payload = await getPayload({ config: configPromise })

  const orderField: 'publishedAt' | 'createdAt' = current.publishedAt ? 'publishedAt' : 'createdAt'
  const orderValue = (current[orderField] || current.createdAt) as string

  const [older, newer] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 0,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      sort: `-${orderField}`,
      select: { slug: true, title: true },
      where: {
        [orderField]: { less_than: orderValue },
      },
    }),
    payload.find({
      collection: 'posts',
      depth: 0,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      sort: orderField,
      select: { slug: true, title: true },
      where: {
        [orderField]: { greater_than: orderValue },
      },
    }),
  ])

  const olderDoc = older.docs?.[0]
  const newerDoc = newer.docs?.[0]

  const olderPost =
    olderDoc && typeof olderDoc.slug === 'string' && typeof olderDoc.title === 'string'
      ? { slug: olderDoc.slug, title: olderDoc.title }
      : null
  const newerPost =
    newerDoc && typeof newerDoc.slug === 'string' && typeof newerDoc.title === 'string'
      ? { slug: newerDoc.slug, title: newerDoc.title }
      : null

  return { olderPost, newerPost }
})

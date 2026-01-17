import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { PostCard } from '@/components/enscribe/blog/PostCard'
import { PageAnimation } from '@/components/PageAnimation'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

import type { Post } from '@/payload-types'

export const dynamic = 'force-static'
export const revalidate = 600

const PAGE_SIZE = 12

type PostListItem = Pick<
  Post,
  'createdAt' | 'publishedAt' | 'slug' | 'title' | 'meta' | 'categories' | 'content' | 'populatedAuthors'
>

function groupPostsByYear(docs: PostListItem[]) {
  const map: Record<string, PostListItem[]> = {}

  for (const doc of docs) {
    const dateValue = doc?.publishedAt || doc?.createdAt
    const year = dateValue ? String(new Date(dateValue).getFullYear()) : 'Unknown'
    if (!map[year]) map[year] = []
    map[year].push(doc)
  }

  const years = Object.keys(map).sort((a, b) => {
    if (a === 'Unknown') return 1
    if (b === 'Unknown') return -1
    return Number(b) - Number(a)
  })

  return { map, years }
}

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: PAGE_SIZE,
    overrideAccess: false,
    sort: '-publishedAt',
    select: {
      title: true,
      slug: true,
      createdAt: true,
      publishedAt: true,
      categories: true,
      meta: true,
      content: true,
      populatedAuthors: true,
    },
  })

  // Old template mode
  if ((process.env.FRONTEND_SHELL || 'template') !== 'enscribe') {
    return (
      <div className="pt-24 pb-24">
        <PageClient />
        <PageAnimation>
          <div className="container mb-16">
            <div className="prose dark:prose-invert max-w-none">
              <h1>Posts</h1>
            </div>
          </div>
        </PageAnimation>

        <PageAnimation delay={0.1}>
          <div className="container mb-8">
            <PageRange collection="posts" currentPage={posts.page} limit={PAGE_SIZE} totalDocs={posts.totalDocs} />
          </div>
        </PageAnimation>

        <PageAnimation delay={0.2}>
          <CollectionArchive posts={posts.docs} />
        </PageAnimation>

        <PageAnimation delay={0.3}>
          <div className="container">
            {posts.totalPages > 1 && posts.page && <Pagination page={posts.page} totalPages={posts.totalPages} />}
          </div>
        </PageAnimation>
      </div>
    )
  }

  const docs = posts.docs as PostListItem[]
  const { map, years } = groupPostsByYear(docs)

  return (
    <div className="mx-auto w-full max-w-3xl py-10">
      <PageAnimation>
        <div className="mb-6">
          <h1 className="text-lg font-medium">Blog</h1>
          {posts.page && (
            <div className="mt-2 text-sm text-muted-foreground">
              <PageRange collection="posts" currentPage={posts.page} limit={PAGE_SIZE} totalDocs={posts.totalDocs} />
            </div>
          )}
        </div>
      </PageAnimation>

      <PageAnimation delay={0.1}>
        <div className="flex min-h-[calc(100vh-18rem)] flex-col gap-y-8">
          {years.map((year) => (
            <section className="flex flex-col gap-y-4" key={year}>
              <div className="font-medium">{year}</div>
              <ul className="flex flex-col gap-4">
                {map[year]?.map((post) => {
                  const dateValue = post?.publishedAt || post?.createdAt
                  const dateLabel = dateValue ? String(new Date(dateValue).getTime()) : ''
                  return (
                    <li key={post.slug || `${year}-${dateLabel}-${post.title || 'post'}`}>
                      <PostCard post={post} />
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </PageAnimation>

      <PageAnimation delay={0.2}>
        {posts?.page && posts?.totalPages > 1 && <Pagination page={posts.page} totalPages={posts.totalPages} />}
      </PageAnimation>
    </div>
  )
}

export function generateMetadata(): Metadata {
  if ((process.env.FRONTEND_SHELL || 'template') === 'enscribe') {
    return { title: 'Blog' }
  }
  return { title: `Payload Website Template Posts` }
}

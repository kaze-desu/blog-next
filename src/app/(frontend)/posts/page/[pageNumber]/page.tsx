import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PostCard } from '@/components/enscribe/blog/PostCard'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import type { Post } from '@/payload-types'

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

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: PAGE_SIZE,
    page: sanitizedPageNumber,
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
        <div className="container mb-16">
          <div className="prose dark:prose-invert max-w-none">
            <h1>Posts</h1>
          </div>
        </div>

        <div className="container mb-8">
          <PageRange collection="posts" currentPage={posts.page} limit={PAGE_SIZE} totalDocs={posts.totalDocs} />
        </div>

        <CollectionArchive posts={posts.docs} />

        <div className="container">
          {posts?.page && posts?.totalPages > 1 && <Pagination page={posts.page} totalPages={posts.totalPages} />}
        </div>
      </div>
    )
  }

  const docs = posts.docs as PostListItem[]
  const { map, years } = groupPostsByYear(docs)

  return (
    <div className="mx-auto w-full max-w-3xl py-10">
      <div className="mb-6">
        <h1 className="text-lg font-medium">Blog</h1>
        <div className="mt-1 text-sm text-muted-foreground">Page {sanitizedPageNumber}</div>
        {posts.page && (
          <div className="mt-2 text-sm text-muted-foreground">
            <PageRange collection="posts" currentPage={posts.page} limit={PAGE_SIZE} totalDocs={posts.totalDocs} />
          </div>
        )}
      </div>

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

      {posts?.page && posts?.totalPages > 1 && <Pagination page={posts.page} totalPages={posts.totalPages} />}
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  if ((process.env.FRONTEND_SHELL || 'template') === 'enscribe') {
    return { title: `Blog - Page ${pageNumber || ''}` }
  }
  return {
    title: `Payload Website Template Posts Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / PAGE_SIZE)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}

import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'
import { formatAuthors } from '@/utilities/formatAuthors'
import { readingTimeFromLexical } from '@/utilities/readingTime'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { CategoryBadge } from './CategoryBadge'

type PostCardData = Pick<
  Post,
  | 'createdAt'
  | 'publishedAt'
  | 'slug'
  | 'title'
  | 'meta'
  | 'categories'
  | 'content'
  | 'populatedAuthors'
  | 'heroImage'
>

function getCategoryLabel(category: unknown): string | null {
  if (typeof category === 'object' && category && 'title' in category) {
    const title = (category as { title?: unknown }).title
    return typeof title === 'string' ? title : null
  }
  return null
}

export function PostCard({ post }: { post: PostCardData }) {
  const href = post.slug ? `/posts/${post.slug}` : '/posts'
  const description = post?.meta?.description || ''
  const dateValue = post?.publishedAt || post?.createdAt
  const dateLabel = dateValue ? formatDateTime(String(dateValue)) : ''
  const image = post.heroImage && typeof post.heroImage !== 'string' ? post.heroImage : null

  const categoryLabels = Array.isArray(post?.categories)
    ? post.categories.map(getCategoryLabel).filter((label): label is string => Boolean(label))
    : []

  const authorLabel =
    post.populatedAuthors && post.populatedAuthors.length > 0 ? formatAuthors(post.populatedAuthors) : ''
  const readTime = post.content ? readingTimeFromLexical(post.content) : ''

  return (
    <div className="border p-4 transition-colors duration-300 ease-in-out hover:bg-secondary/50">
      <Link className="flex flex-col gap-4 sm:flex-row" href={href}>
        <div className="w-full sm:w-60 sm:shrink-0">
          <div className="relative aspect-[1200/630] w-full overflow-hidden border">
            {image && typeof image !== 'string' ? (
              <Media fill imgClassName="object-cover" pictureClassName="absolute inset-0" resource={image} />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-4 text-xs text-muted-foreground">No image</div>
            )}
          </div>
        </div>

        <div className="grow">
          <h3 className="mb-2 text-lg font-medium leading-6">{post.title}</h3>
          {description ? <p className="mb-2 text-sm text-muted-foreground">{description}</p> : null}

          <div className="mb-2 flex flex-wrap items-center text-xs text-muted-foreground">
            {authorLabel ? <span className="text-foreground">{authorLabel}</span> : null}
            {authorLabel && (dateLabel || readTime) ? <span className="px-2 opacity-60">•</span> : null}
            {dateLabel ? <span>{dateLabel}</span> : null}
            {dateLabel && readTime ? <span className="px-2 opacity-60">•</span> : null}
            {readTime ? <span>{readTime}</span> : null}
          </div>

          {categoryLabels.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categoryLabels.map((label) => (
                <CategoryBadge key={label} label={label} showIcon />
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </div>
  )
}



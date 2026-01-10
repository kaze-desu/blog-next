import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { Calendar, User, Hash, BookOpen, Clock, Folder } from 'lucide-react'
import { readingTimeFromLexical, lexicalWordCount } from '@/utilities/readingTime'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, lastEdited, tags, title, content } =
    post

  const hasAuthors =
    populatedAuthors &&
    Array.isArray(populatedAuthors) &&
    populatedAuthors.length > 0 &&
    populatedAuthors.some(
      (author) => typeof author === 'object' && author !== null && 'name' in author,
    )

  const hasTags =
    Array.isArray(tags) &&
    tags.length > 0 &&
    tags.some((tag) => typeof tag === 'object' && tag !== null)

  const wordCount = content ? lexicalWordCount(content) : 0
  const readingTime = content ? readingTimeFromLexical(content) : ''

  // Format tags as comma-separated string
  const tagsString = hasTags
    ? tags
        .map((tag) => {
          if (typeof tag === 'object' && tag !== null && 'title' in tag && tag.title) {
            return tag.title
          }
          return null
        })
        .filter((t): t is string => t !== null)
        .join(', ')
    : ''

  // Build first line: Author | date -> modified
  const firstLineParts: string[] = []
  if (hasAuthors && populatedAuthors && Array.isArray(populatedAuthors)) {
    // Type guard to ensure authors are objects with name property
    const validAuthors = populatedAuthors.filter(
      (author): author is { id?: string | null; name?: string | null } =>
        typeof author === 'object' && author !== null && 'name' in author,
    )
    if (validAuthors.length > 0) {
      const authorNames = validAuthors
        .map((author) => author.name)
        .filter((name): name is string => Boolean(name))
      if (authorNames.length > 0) {
        const authorStr =
          authorNames.length === 1
            ? authorNames[0]
            : authorNames.length === 2
              ? `${authorNames[0]} and ${authorNames[1]}`
              : `${authorNames.slice(0, -1).join(', ')} and ${authorNames[authorNames.length - 1]}`
        firstLineParts.push(authorStr)
      }
    }
  }
  if (publishedAt) {
    const dateStr = formatDateTime(String(publishedAt))
    if (lastEdited && String(lastEdited) !== String(publishedAt)) {
      firstLineParts.push(`${dateStr} -> ${formatDateTime(String(lastEdited))}`)
    } else {
      firstLineParts.push(dateStr)
    }
  }

  // Build second line: wordCount | readingTime | tags
  const secondLineParts: string[] = []
  if (wordCount > 0) {
    secondLineParts.push(`${wordCount.toLocaleString()} words`)
  }
  if (readingTime) {
    secondLineParts.push(readingTime)
  }
  if (tagsString) {
    secondLineParts.push(tagsString)
  }

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          {/* Title */}
          <h1 className="mb-6 text-3xl md:text-4xl lg:text-5xl xl:text-6xl">{title}</h1>

          {/* Metadata lines separated by | */}
          <div className="flex flex-col gap-2 text-sm text-white/90">
            {/* First line: Author wrote in category | date -> modified */}
            {firstLineParts.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {hasAuthors && populatedAuthors && Array.isArray(populatedAuthors) && (
                  <>
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>
                        {(() => {
                          const validAuthors = populatedAuthors.filter(
                            (author): author is { id?: string | null; name?: string | null } =>
                              typeof author === 'object' && author !== null && 'name' in author,
                          )
                          const authorNames = validAuthors
                            .map((author) => author.name)
                            .filter((name): name is string => Boolean(name))
                          if (authorNames.length === 0) return ''
                          if (authorNames.length === 1) return authorNames[0]
                          if (authorNames.length === 2)
                            return `${authorNames[0]} and ${authorNames[1]}`
                          return `${authorNames.slice(0, -1).join(', ')} and ${authorNames[authorNames.length - 1]}`
                        })()}
                      </span>
                      {categories && categories.length > 0 && (
                        <>
                          <span className="text-white/50">wrote in</span>
                          <span className="inline-flex items-center gap-1.5">
                            <Folder className="h-3.5 w-3.5" />
                            <span>
                              {categories
                                .map((category) => {
                                  if (typeof category === 'object' && category !== null) {
                                    return category.title || 'Untitled category'
                                  }
                                  return null
                                })
                                .filter((title): title is string => title !== null)
                                .join(', ')}
                            </span>
                          </span>
                        </>
                      )}
                    </span>
                    {publishedAt && <span className="text-white/50">|</span>}
                  </>
                )}
                {publishedAt && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <time dateTime={publishedAt}>{formatDateTime(String(publishedAt))}</time>
                    {lastEdited && String(lastEdited) !== String(publishedAt) && (
                      <>
                        <span className="mx-1">-&gt;</span>
                        <time dateTime={String(lastEdited)}>
                          {formatDateTime(String(lastEdited))}
                        </time>
                      </>
                    )}
                  </span>
                )}
              </div>
            )}

            {/* Second line: wordCount | readingTime | tags */}
            {secondLineParts.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {wordCount > 0 && (
                  <>
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{wordCount.toLocaleString()} words</span>
                    </span>
                    {(readingTime || tagsString) && <span className="text-white/50">|</span>}
                  </>
                )}
                {readingTime && (
                  <>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{readingTime}</span>
                    </span>
                    {tagsString && <span className="text-white/50">|</span>}
                  </>
                )}
                {tagsString && (
                  <span className="inline-flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5" />
                    <span>{tagsString}</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName="-z-10 object-cover" resource={heroImage} />
        )}
        <div className="absolute pointer-events-none left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>
    </div>
  )
}

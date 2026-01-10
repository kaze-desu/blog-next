import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import { Calendar, User, Hash, ArrowRight } from 'lucide-react'
import { cn } from '@/utilities/ui'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, lastEdited, tags, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  const hasTags =
    Array.isArray(tags) &&
    tags.length > 0 &&
    tags.some((tag) => typeof tag === 'object' && tag !== null)

  return (
    <div className="relative -mt-[10.4rem] flex items-end">
      <div className="container z-10 relative lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <div className="uppercase text-sm mb-6">
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle } = category

                const titleToUse = categoryTitle || 'Untitled category'

                const isLast = index === categories.length - 1

                return (
                  <React.Fragment key={index}>
                    {titleToUse}
                    {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                  </React.Fragment>
                )
              }
              return null
            })}
          </div>

          <div className="">
            <h1 className="mb-6 text-4xl md:text-6xl lg:text-7xl xl:text-8xl">{title}</h1>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {hasAuthors && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1.5 text-sm',
                  )}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>{formatAuthors(populatedAuthors)}</span>
                </span>
              )}
              {publishedAt && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1.5 text-sm',
                  )}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
                  {lastEdited && lastEdited !== publishedAt && (
                    <>
                      <ArrowRight className="h-3 w-3 mx-0.5" />
                      <time dateTime={lastEdited}>{formatDateTime(lastEdited)}</time>
                    </>
                  )}
                </span>
              )}
            </div>

            {hasTags && (
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag) => {
                  if (typeof tag === 'object' && tag !== null && 'title' in tag && tag.title) {
                    const tagId = 'id' in tag ? tag.id : String(tag)
                    return (
                      <span
                        key={tagId}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-2.5 py-1 text-xs',
                        )}
                      >
                        <Hash className="h-3 w-3" />
                        <span>{tag.title}</span>
                      </span>
                    )
                  }
                  return null
                })}
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

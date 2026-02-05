'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
  variant?: 'default' | 'compact'
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps, variant = 'default' } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const compactDescription =
    sanitizedDescription && sanitizedDescription.length > 140
      ? `${sanitizedDescription.slice(0, 140).trim()}…`
      : sanitizedDescription
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        variant === 'compact' && 'text-sm text-left',
        className,
      )}
      ref={card.ref}
    >
      <div className={cn('relative w-full', variant === 'compact' ? 'h-32 overflow-hidden' : '')}>
        {!metaImage && <div className="">No image</div>}
        {metaImage && typeof metaImage !== 'string' && variant === 'compact' ? (
          <Media
            fill
            imgClassName="object-cover"
            pictureClassName="absolute inset-0"
            resource={metaImage}
            size="(max-width: 640px) 100vw, 50vw"
          />
        ) : null}
        {metaImage && typeof metaImage !== 'string' && variant !== 'compact' ? (
          <Media resource={metaImage} size="33vw" />
        ) : null}
      </div>
      <div className={cn('p-4', variant === 'compact' && 'p-3')}>
        {showCategories && hasCategories && (
          <div className={cn('uppercase mb-4', variant === 'compact' && 'mb-2 text-xs')}>
            <div>
              {categories?.map((category, index) => {
                if (typeof category === 'object') {
                  const { title: titleFromCategory } = category

                  const categoryTitle = titleFromCategory || 'Untitled category'

                  const isLast = index === categories.length - 1

                  return (
                    <Fragment key={index}>
                      {categoryTitle}
                      {!isLast && <Fragment>, &nbsp;</Fragment>}
                    </Fragment>
                  )
                }

                return null
              })}
            </div>
          </div>
        )}
        {titleToUse && (
          <div className={cn('prose', variant === 'compact' && 'text-sm')}>
            <h3 className={cn(variant === 'compact' && 'text-base leading-6')}>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && (
          <div className={cn('mt-2', variant === 'compact' && 'text-xs text-muted-foreground')}>
            <p>{variant === 'compact' ? compactDescription : sanitizedDescription}</p>
          </div>
        )}
      </div>
    </article>
  )
}

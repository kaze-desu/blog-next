import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { Card } from '../../components/Card'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: DefaultTypedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <div className={clsx(className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="grid w-full grid-cols-1 gap-3 items-stretch">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return (
            <Card
              key={index}
              className="w-full"
              doc={doc}
              relationTo="posts"
              showCategories
              variant="compact"
            />
          )
        })}
      </div>
    </div>
  )
}

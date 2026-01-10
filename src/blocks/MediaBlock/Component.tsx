import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '../../components/Media'
import { ClickableMediaWrapper } from './ClickableMediaWrapper.client'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  return (
    <div
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {(media || staticImage) && (
        <>
          {typeof media === 'object' && media && !staticImage ? (
            <ClickableMediaWrapper media={media} imgClassName={imgClassName} />
          ) : (
            <Media
              imgClassName={cn('rounded-[0.9rem]', imgClassName)}
              resource={media}
              src={staticImage}
            />
          )}
        </>
      )}
      {caption && (
        <div
          className={cn(
            'mt-1',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <div className="text-sm text-center text-gray-500">
            <RichText data={caption} enableGutter={false} />
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import React, { useContext } from 'react'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { ClickableMedia } from './ClickableMedia.client'
import { LightboxContext } from '@/components/Lightbox/LightboxProvider.client'

type Props = {
  media: MediaType
  imgClassName?: string
}

/**
 * Wrapper that safely uses ClickableMedia only when lightbox context is available
 */
export function ClickableMediaWrapper({ media, imgClassName }: Props) {
  // Check if lightbox context is available without throwing
  const lightboxContext = useContext(LightboxContext)

  if (!lightboxContext) {
    // Not in lightbox context, render as regular image
    return <Media imgClassName={cn('rounded-[0.9rem]', imgClassName)} resource={media} />
  }

  return <ClickableMedia media={media} imgClassName={imgClassName} />
}

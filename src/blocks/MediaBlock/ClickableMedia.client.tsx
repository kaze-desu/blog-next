'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Media } from '@/components/Media'
import { useLightbox } from '@/components/Lightbox/LightboxProvider.client'
import type { Media as MediaType } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Props = {
  media: MediaType
  imgClassName?: string
}

export function ClickableMedia({ media, imgClassName }: Props) {
  const lightbox = useLightbox()
  const imageRef = useRef<HTMLDivElement>(null)
  const [imageIndex, setImageIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!lightbox || !imageRef.current) return

    const container = imageRef.current.closest('.payload-richtext')
    const currentElement = imageRef.current
    if (!container || !currentElement) return

    const registerImage = () => {
      const allImages = container.querySelectorAll('[data-lightbox-image]')
      const currentIndex = Array.from(allImages).indexOf(currentElement)
      if (currentIndex >= 0) {
        setImageIndex(currentIndex)
        lightbox.registerImage(media, currentIndex)
      }
    }

    // Register after DOM is ready
    requestAnimationFrame(registerImage)
  }, [lightbox, media])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (lightbox && imageIndex !== null && imageIndex < lightbox.slides.length) {
      lightbox.openLightbox(imageIndex)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick(e as any)
    }
  }

  return (
    <div
      ref={imageRef}
      data-lightbox-image
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Open image in lightbox"
      className={cn(
        'relative cursor-pointer transition-opacity hover:opacity-90',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
      )}
    >
      <div className="pointer-events-none">
        <Media imgClassName={cn('rounded-lg', imgClassName)} resource={media} />
      </div>
    </div>
  )
}

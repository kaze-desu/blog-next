'use client'

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import type { Media as MediaType } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { lexicalToPlainText } from '@/utilities/readingTime'

// Dynamically import lightbox to reduce initial bundle size
const Lightbox = dynamic(() => import('yet-another-react-lightbox').then((mod) => mod.default), {
  ssr: false,
})

// Import lightbox styles
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import './lightbox.css'

type LightboxSlide = {
  src: string
  alt?: string
  width?: number
  height?: number
  title?: string
  description?: string
}

interface LightboxContextType {
  openLightbox: (index: number) => void
  registerImage: (image: MediaType, index: number) => void
  slides: LightboxSlide[]
}

export const LightboxContext = createContext<LightboxContextType | null>(null)

export function useLightbox() {
  const context = useContext(LightboxContext)
  if (!context) {
    throw new Error('useLightbox must be used within LightboxProvider')
  }
  return context
}

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [slides, setSlides] = useState<LightboxSlide[]>([])
  const [CaptionsPlugin, setCaptionsPlugin] = useState<any>(null)

  // Load Captions plugin on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('yet-another-react-lightbox/plugins/captions').then((mod) => {
        setCaptionsPlugin(() => mod.default)
      })
    }
  }, [])

  const registerImage = useCallback((image: MediaType, imageIndex: number) => {
    if (typeof image !== 'object' || !image.url) return

    // Extract caption text from Lexical editor state
    let description: string | undefined
    if (image.caption) {
      description = lexicalToPlainText(image.caption)
    }

    const slide: LightboxSlide = {
      src: getMediaUrl(image.url, image.updatedAt),
      alt: image.alt || '',
      width: image.width || undefined,
      height: image.height || undefined,
      description: description || undefined,
    }

    setSlides((prev) => {
      const newSlides = [...prev]
      while (newSlides.length <= imageIndex) {
        newSlides.push({ src: '', alt: '' })
      }
      newSlides[imageIndex] = slide
      return newSlides
    })
  }, [])

  const openLightbox = useCallback(
    (slideIndex: number) => {
      const validSlides = slides.filter((slide) => slide?.src && slide.src !== '')
      if (slideIndex >= 0 && slideIndex < validSlides.length) {
        setIndex(slideIndex)
        setOpen(true)
      }
    },
    [slides],
  )

  const validSlides = useMemo(() => {
    return slides.filter((slide) => slide?.src && slide.src !== '')
  }, [slides])

  const value = useMemo(
    () => ({
      openLightbox,
      registerImage,
      slides: validSlides,
    }),
    [openLightbox, registerImage, validSlides],
  )

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {validSlides.length > 0 && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={validSlides}
          plugins={CaptionsPlugin ? [CaptionsPlugin] : []}
          captions={
            CaptionsPlugin
              ? {
                  descriptionTextAlign: 'center',
                  descriptionMaxLines: 3,
                }
              : undefined
          }
        />
      )}
    </LightboxContext.Provider>
  )
}

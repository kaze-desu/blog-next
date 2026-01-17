'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/utilities/ui'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 300px
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const size = 40

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className={cn(
            'fixed bottom-20 right-6 z-[100]',
            'flex items-center justify-center',
            'rounded-full',
            'bg-background/80 dark:bg-background/90',
            'backdrop-blur-sm',
            'shadow-md',
            'border-[4px] border-border/50',
            'hover:bg-background/90 dark:hover:bg-background/95',
            'transition-colors duration-200',
            'cursor-pointer',
            'pointer-events-auto',
          )}
          style={{ width: size, height: size }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4 text-foreground/80" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

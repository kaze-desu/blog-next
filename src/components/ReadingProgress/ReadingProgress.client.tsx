'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/utilities/ui'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Use the correct window/document context (works in both regular page and iframe preview)
    const win = typeof window !== 'undefined' ? window : null
    const doc = typeof document !== 'undefined' ? document : null

    if (!win || !doc) return

    const calculateProgress = () => {
      // Use requestAnimationFrame to ensure DOM is ready (important for iframe preview)
      requestAnimationFrame(() => {
        const windowHeight = win.innerHeight
        const documentHeight = doc.documentElement.scrollHeight
        const scrollTop = win.scrollY || doc.documentElement.scrollTop

        // Calculate scrollable distance (total height minus viewport)
        const scrollableDistance = documentHeight - windowHeight

        // Calculate percentage based on how far we've scrolled
        // When scrollTop = 0, percentage = 0%
        // When scrollTop = scrollableDistance, percentage = 100%
        let percentage =
          scrollableDistance > 0
            ? Math.min(100, Math.max(0, (scrollTop / scrollableDistance) * 100))
            : 100 // If page is shorter than viewport, show 100%

        // Round to avoid floating point precision issues
        percentage = Math.round(percentage * 100) / 100

        // Consider 99.5% or higher as complete (handles edge cases in iframe)
        if (percentage >= 99.5) {
          percentage = 100
        }

        setProgress(percentage)
      })
    }

    // Calculate initial progress after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(calculateProgress, 100)

    // Update on scroll
    win.addEventListener('scroll', calculateProgress, { passive: true })
    win.addEventListener('resize', calculateProgress, { passive: true })

    return () => {
      clearTimeout(timeoutId)
      win.removeEventListener('scroll', calculateProgress)
      win.removeEventListener('resize', calculateProgress)
    }
  }, [])

  // Circle properties
  const size = 40
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  const isComplete = progress >= 100
  const displayProgress = Math.round(progress)

  const scrollToTop = () => {
    // Use the correct window context (works in both regular page and iframe preview)
    const win = typeof window !== 'undefined' ? window : null
    if (!win) return

    win.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className={cn(
        'fixed bottom-6 right-6 z-[100]',
        'flex items-center justify-center',
        'rounded-full',
        'pointer-events-auto',
        isComplete && 'cursor-pointer',
      )}
      style={{ width: size, height: size }}
      onClick={isComplete ? scrollToTop : undefined}
      role={isComplete ? 'button' : undefined}
      aria-label={isComplete ? 'Scroll to top' : undefined}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          className={cn(
            'transition-colors duration-300',
            isComplete ? 'text-green-500 dark:text-green-400' : 'text-foreground/60',
          )}
          style={{
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.1s linear',
          }}
        />
      </svg>
      {/* Percentage text or arrow icon */}
      {isComplete ? (
        <ArrowUp
          className={cn(
            'w-4 h-4',
            'select-none',
            'relative z-10',
            'text-green-500 dark:text-green-400',
          )}
        />
      ) : (
        <span
          className={cn(
            'text-[9px] font-semibold',
            'select-none',
            'relative z-10',
            'text-foreground/80',
          )}
        >
          {displayProgress}%
        </span>
      )}
    </motion.div>
  )
}

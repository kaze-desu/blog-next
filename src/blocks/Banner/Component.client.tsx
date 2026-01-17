'use client'
import { cn } from '@/utilities/ui'
import React, { useState } from 'react'
import RichText from '@/components/RichText'
import { motion, AnimatePresence } from 'motion/react'
import {
  Info,
  AlertTriangle,
  Lightbulb,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  XCircle,
  Info as InfoIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

type Props = {
  className?: string
  content: any
  style: 'note' | 'warning' | 'tip' | 'important' | 'question' | 'success' | 'error' | 'info'
  title?: string | null
}

const bannerConfig = {
  note: {
    icon: Info,
    color: 'blue',
    borderColor: 'border-blue-500',
    titleBgColor: 'bg-blue-200 dark:bg-blue-900/60',
    contentBgColor: 'bg-blue-50 dark:bg-blue-950/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    iconColor: 'text-blue-600 dark:text-blue-400',
    defaultTitle: 'Note',
  },
  warning: {
    icon: AlertTriangle,
    color: 'amber',
    borderColor: 'border-amber-500',
    titleBgColor: 'bg-amber-200 dark:bg-amber-900/60',
    contentBgColor: 'bg-amber-50 dark:bg-amber-950/30',
    textColor: 'text-amber-700 dark:text-amber-300',
    iconColor: 'text-amber-600 dark:text-amber-400',
    defaultTitle: 'Warning',
  },
  tip: {
    icon: Lightbulb,
    color: 'green',
    borderColor: 'border-green-500',
    titleBgColor: 'bg-green-200 dark:bg-green-900/60',
    contentBgColor: 'bg-green-50 dark:bg-green-950/30',
    textColor: 'text-green-700 dark:text-green-300',
    iconColor: 'text-green-600 dark:text-green-400',
    defaultTitle: 'Tip',
  },
  important: {
    icon: AlertCircle,
    color: 'red',
    borderColor: 'border-red-500',
    titleBgColor: 'bg-red-200 dark:bg-red-900/60',
    contentBgColor: 'bg-red-50 dark:bg-red-950/30',
    textColor: 'text-red-700 dark:text-red-300',
    iconColor: 'text-red-600 dark:text-red-400',
    defaultTitle: 'Important',
  },
  question: {
    icon: HelpCircle,
    color: 'purple',
    borderColor: 'border-purple-500',
    titleBgColor: 'bg-purple-200 dark:bg-purple-900/60',
    contentBgColor: 'bg-purple-50 dark:bg-purple-950/30',
    textColor: 'text-purple-700 dark:text-purple-300',
    iconColor: 'text-purple-600 dark:text-purple-400',
    defaultTitle: 'Question',
  },
  success: {
    icon: CheckCircle,
    color: 'green',
    borderColor: 'border-green-500',
    titleBgColor: 'bg-green-200 dark:bg-green-900/60',
    contentBgColor: 'bg-green-50 dark:bg-green-950/30',
    textColor: 'text-green-700 dark:text-green-300',
    iconColor: 'text-green-600 dark:text-green-400',
    defaultTitle: 'Success',
  },
  error: {
    icon: XCircle,
    color: 'red',
    borderColor: 'border-red-500',
    titleBgColor: 'bg-red-200 dark:bg-red-900/60',
    contentBgColor: 'bg-red-50 dark:bg-red-950/30',
    textColor: 'text-red-700 dark:text-red-300',
    iconColor: 'text-red-600 dark:text-red-400',
    defaultTitle: 'Error',
  },
  info: {
    icon: InfoIcon,
    color: 'cyan',
    borderColor: 'border-cyan-500',
    titleBgColor: 'bg-cyan-200 dark:bg-cyan-900/60',
    contentBgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
    textColor: 'text-cyan-700 dark:text-cyan-300',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    defaultTitle: 'Info',
  },
} as const

export const BannerBlockClient: React.FC<Props> = ({ className, content, style, title }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const config = bannerConfig[style || 'info']
  const Icon = config.icon
  const displayTitle = title || config.defaultTitle

  return (
    <div
      className={cn(
        'my-2 overflow-hidden rounded-lg border-l-4',
        config.borderColor,
        config.contentBgColor,
        className,
      )}
    >
      {/* Title with darker background - Obsidian style: rounded top corners only */}
      <div
        className={cn(
          'relative flex items-center gap-1.5 rounded-t-lg px-2.5 py-1.5 font-semibold',
          config.textColor,
          config.titleBgColor,
        )}
      >
        <Icon className={cn('h-4 w-4 flex-shrink-0', config.iconColor)} />
        <span className="flex-1">{displayTitle}</span>
        {/* Chevron button at absolute right */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute right-2.5 flex items-center justify-center w-5 h-5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          type="button"
        >
          {isExpanded ? (
            <ChevronUp className={cn('h-4 w-4', config.iconColor)} />
          ) : (
            <ChevronDown className={cn('h-4 w-4', config.iconColor)} />
          )}
        </button>
      </div>

      {/* Content with lighter background - Obsidian style: no box-shadow, specific padding, no margins */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: 'linear',
            }}
            className="banner-content overflow-hidden [&_.banner-content]:ml-4 [&_.banner-content]:border-l-2 [&_.banner-content]:pl-4 [&_.banner-content]:mt-2 [&>*]:!mt-0 [&>*]:!mb-0 [&_*]:shadow-none px-2.5 py-1.5"
          >
            {content && <RichText data={content} enableGutter={false} enableProse={false} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

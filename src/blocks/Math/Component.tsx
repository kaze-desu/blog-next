'use client'
import React from 'react'
import { renderToString } from 'katex'
import 'katex/dist/katex.min.css'
import { cn } from '@/utilities/ui'

export type MathBlockProps = {
  formula: string
  blockType: 'math'
}

type Props = MathBlockProps & {
  className?: string
}

export const MathBlock: React.FC<Props> = ({ className, formula }) => {
  if (!formula) return null

  try {
    const html = renderToString(formula, {
      throwOnError: false,
      displayMode: true,
      output: 'html',
    })

    return (
      <div className={cn('not-prose', className)}>
        <div
          className={cn(
            // Responsive horizontal scrollbar container
            'overflow-x-auto overflow-y-visible',
            // Prevent vertical overflow
            'w-full my-4',
          )}
          style={{
            // Force horizontal scrollbar on WebKit browsers and enable smooth scrolling
            WebkitOverflowScrolling: 'touch',
            // Ensure scrollbar is always visible when content overflows
            scrollbarWidth: 'thin',
          }}
        >
          <div
            className={cn(
              'flex justify-center',
              // Allow formula to be wider than container on mobile
              'min-w-fit',
              // Prevent text selection issues
              'select-text',
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div
        className={cn(
          'not-prose p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg',
          className,
        )}
      >
        <p className="text-red-600 dark:text-red-400 text-sm">
          Error rendering formula: {error instanceof Error ? error.message : 'Invalid LaTeX syntax'}
        </p>
        <pre className="mt-2 text-xs text-red-500 dark:text-red-300 overflow-x-auto">{formula}</pre>
      </div>
    )
  }
}

'use client'
import React, { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { cn } from '@/utilities/ui'

export type MermaidBlockProps = {
  diagram: string
  blockType: 'mermaid'
}

type Props = MermaidBlockProps & {
  className?: string
}

export const MermaidBlock: React.FC<Props> = ({ className, diagram }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMountedRef = useRef(true)
  const [error, setError] = useState<string | null>(null)
  const [isRendering, setIsRendering] = useState(true)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    // Check theme after hydration
    const checkTheme = () => {
      if (!isMountedRef.current) return
      const theme = document.documentElement.getAttribute('data-theme')
      setIsDark(theme === 'dark')
    }

    checkTheme()

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!diagram || !containerRef.current || !isMountedRef.current) return

    // Determine theme based on dark mode
    const mermaidTheme = isDark ? 'dark' : 'default'

    // Initialize Mermaid with theme-aware settings
    mermaid.initialize({
      startOnLoad: false,
      theme: mermaidTheme,
      securityLevel: 'loose',
      fontFamily: 'inherit',
      // Use default sizes - don't constrain the diagram
    })

    let cancelled = false

    const renderDiagram = async () => {
      if (cancelled || !isMountedRef.current) return

      try {
        setError(null)
        setIsRendering(true)

        // Generate unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

        // Clear previous content
        if (containerRef.current && isMountedRef.current) {
          containerRef.current.innerHTML = ''
          const svgContainer = document.createElement('div')
          svgContainer.id = id
          svgContainer.className = 'mermaid'
          svgContainer.textContent = diagram
          containerRef.current.appendChild(svgContainer)
        }

        // Render the diagram using the correct API
        const element = containerRef.current?.querySelector(`#${id}`) as HTMLElement
        if (element && isMountedRef.current && !cancelled) {
          await mermaid.run({
            nodes: [element],
          })
        }

        if (isMountedRef.current && !cancelled) {
          setIsRendering(false)
        }
      } catch (err) {
        if (isMountedRef.current && !cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render Mermaid diagram')
          setIsRendering(false)
        }
      }
    }

    renderDiagram()

    return () => {
      cancelled = true
    }
  }, [diagram, isDark])

  if (!diagram) return null

  return (
    <div className={cn('not-prose my-4', className)}>
      <div
        className={cn('overflow-x-auto overflow-y-visible w-full', 'flex justify-center')}
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
        }}
      >
        {isRendering && !error && (
          <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-sm">Rendering diagram...</div>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">
              Error rendering diagram: {error}
            </p>
            <pre className="mt-2 text-xs text-red-500 dark:text-red-300 overflow-x-auto whitespace-pre-wrap">
              {diagram}
            </pre>
          </div>
        )}
        <div
          ref={containerRef}
          className="flex justify-center [&_svg]:max-w-none [&_svg]:h-auto [&_svg]:w-auto [&_svg]:min-w-0"
        />
      </div>
    </div>
  )
}

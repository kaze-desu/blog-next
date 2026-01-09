'use client'

import { toKebabCase } from '@/utilities/toKebabCase'
import { cn } from '@/utilities/ui'
import { ChevronDown } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'

type TocItem = {
  id: string
  text: string
  depth: number
}

const HEADER_OFFSET_PX = 120
const PROGRESS_RADIUS = 10
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS

function slugifyHeading(text: string) {
  return toKebabCase(
    text
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, ' '),
  )
}

function indentClass(depth: number) {
  // h2 -> 0, h3 -> 1, ...
  const level = Math.max(0, Math.min(4, depth - 2))
  return ['ml-0', 'ml-4', 'ml-8', 'ml-12', 'ml-16'][level]
}

export function PostWithTOC({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const currentText = useMemo(() => {
    if (!activeId) return 'Overview'
    return toc.find((t) => t.id === activeId)?.text || 'Overview'
  }, [activeId, toc])

  useEffect(() => {
    const root = contentRef.current
    if (!root) return

    const headings = Array.from(
      root.querySelectorAll<HTMLElement>('.payload-richtext h2, .payload-richtext h3, .payload-richtext h4, .payload-richtext h5, .payload-richtext h6'),
    )

    if (headings.length === 0) {
      setToc([])
      return
    }

    const usedIds = new Map<string, number>()

    const items: TocItem[] = headings
      .map((el) => {
        const text = (el.textContent || '').trim()
        if (!text) return null

        const tag = el.tagName.toLowerCase()
        const depth = Number(tag.replace('h', '')) || 2

        let id = el.id?.trim()
        if (!id) {
          id = slugifyHeading(text) || 'section'
        }

        const count = usedIds.get(id) ?? 0
        usedIds.set(id, count + 1)
        if (count > 0) id = `${id}-${count + 1}`

        el.id = id
        // make anchor scrolling avoid the sticky headers
        el.style.scrollMarginTop = `${HEADER_OFFSET_PX}px`

        return { id, text, depth }
      })
      .filter(Boolean) as TocItem[]

    setToc(items)
  }, [children])

  useEffect(() => {
    if (toc.length === 0) return

    const getProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const p = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0
      setProgress(p)
    }

    const getActiveId = () => {
      // Find the last heading above the viewport top (+ offset)
      const viewportTop = window.scrollY + HEADER_OFFSET_PX

      let current: string | null = null
      for (const item of toc) {
        const el = document.getElementById(item.id)
        if (!el) continue
        if (el.offsetTop <= viewportTop) current = item.id
        else break
      }
      setActiveId(current)
    }

    const onScroll = () => {
      getProgress()
      getActiveId()
    }

    const onResize = () => {
      getProgress()
      getActiveId()
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [toc])

  const dashOffset = PROGRESS_CIRCUMFERENCE * (1 - progress)

  return (
    <div className="xl:grid xl:grid-cols-[16rem_minmax(0,1fr)] xl:gap-8">
      {/* Desktop TOC */}
      {toc.length > 0 ? (
        <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] max-w-md xl:block">
          <div className="max-h-[calc(100vh-8rem)] overflow-auto pr-2">
            <div className="px-2 py-2 text-xs font-medium text-muted-foreground">On this page</div>
            <ul className="flex list-none flex-col gap-y-2 px-2">
              {toc.map((item) => (
                <li
                  className={cn('text-sm text-foreground/60', indentClass(item.depth))}
                  key={item.id}
                >
                  <a
                    className={cn(
                      'underline decoration-transparent underline-offset-[3px] transition-colors duration-200 hover:decoration-inherit',
                      item.id === activeId && 'text-foreground',
                    )}
                    href={`#${item.id}`}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      ) : (
        <aside className="hidden xl:block" />
      )}

      <div>
        {/* Mobile TOC */}
        {toc.length > 0 ? (
          <div className="sticky top-12 z-40 w-full border-y bg-background/50 backdrop-blur-sm xl:hidden">
            <details
              className="group"
              onToggle={(e) => setDetailsOpen((e.target as HTMLDetailsElement).open)}
              open={detailsOpen}
            >
              <summary className="flex w-full cursor-pointer list-none items-center justify-between">
                <div className="mx-auto flex w-full max-w-3xl items-center px-4 py-3">
                  <div className="relative mr-2 h-4 w-4">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="text-primary/20"
                        cx="12"
                        cy="12"
                        r={PROGRESS_RADIUS}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        className="text-primary"
                        cx="12"
                        cy="12"
                        r={PROGRESS_RADIUS}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={PROGRESS_CIRCUMFERENCE}
                        strokeDashoffset={dashOffset}
                        transform="rotate(-90 12 12)"
                      />
                    </svg>
                  </div>

                  <span className="text-muted-foreground flex-grow truncate text-sm">{currentText}</span>
                  <span className="text-muted-foreground ml-2">
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
                  </span>
                </div>
              </summary>

              <div className="max-h-[30vh] overflow-auto">
                <ul className="flex list-none flex-col gap-y-2 px-4 pb-4">
                  {toc.map((item) => (
                    <li className={cn('px-4 text-sm text-foreground/60', indentClass(item.depth))} key={item.id}>
                      <a
                        className={cn(
                          'underline decoration-transparent underline-offset-[3px] transition-colors duration-200 hover:decoration-inherit',
                          item.id === activeId && 'text-foreground',
                        )}
                        href={`#${item.id}`}
                        onClick={() => setDetailsOpen(false)}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        ) : null}

        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  )
}



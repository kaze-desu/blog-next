'use client'
import React, { useEffect, useRef } from 'react'
import { renderToString } from 'katex'
import 'katex/dist/katex.min.css'

// Regex to match $...$ but not $$...$$ (display math)
const INLINE_MATH_REGEX = /(?<!\$)\$([^$\n]+)\$(?!\$)/g

type Props = {
  children: React.ReactNode
}

export function InlineMathProcessor({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasProcessedRef = useRef(false)

  useEffect(() => {
    // Only process once on mount, not on updates
    if (!containerRef.current || hasProcessedRef.current) return

    const processTextNodes = (element: HTMLElement) => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          // Skip if parent is already processed or is a code block
          const parent = node.parentElement
          if (parent?.classList.contains('inline-math') || parent?.closest('pre, code')) {
            return NodeFilter.FILTER_REJECT
          }
          return NodeFilter.FILTER_ACCEPT
        },
      })

      const textNodes: Text[] = []
      let node: Text | null

      while ((node = walker.nextNode() as Text)) {
        const text = node.textContent || ''
        if (/(?<!\$)\$[^$\n]+\$(?!\$)/.test(text)) {
          textNodes.push(node)
        }
      }

      textNodes.forEach((textNode) => {
        const text = textNode.textContent || ''
        const mathRegex = /(?<!\$)\$([^$\n]+)\$(?!\$)/g
        const matches = Array.from(text.matchAll(mathRegex))

        if (matches.length === 0) return

        const parent = textNode.parentElement
        if (!parent) return

        const fragments: (string | HTMLElement)[] = []
        let lastIndex = 0

        matches.forEach((match) => {
          if (match.index === undefined) return

          if (match.index > lastIndex) {
            fragments.push(text.substring(lastIndex, match.index))
          }

          try {
            const formula = match[1].trim()
            if (formula) {
              const html = renderToString(formula, {
                throwOnError: false,
                displayMode: false,
                output: 'html',
              })
              const span = document.createElement('span')
              span.className = 'inline-math'
              span.setAttribute('data-formula', formula)
              span.innerHTML = html
              fragments.push(span)
            } else {
              fragments.push(match[0])
            }
          } catch {
            fragments.push(match[0])
          }

          lastIndex = match.index + match[0].length
        })

        if (lastIndex < text.length) {
          fragments.push(text.substring(lastIndex))
        }

        if (fragments.length > 0) {
          const docFragment = document.createDocumentFragment()
          fragments.forEach((fragment) => {
            if (typeof fragment === 'string') {
              docFragment.appendChild(document.createTextNode(fragment))
            } else {
              docFragment.appendChild(fragment)
            }
          })
          textNode.replaceWith(docFragment)
        }
      })

      hasProcessedRef.current = true
    }

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (containerRef.current && !hasProcessedRef.current) {
        processTextNodes(containerRef.current)
      }
    })
  }, []) // Empty deps - only run once on mount

  return (
    <div ref={containerRef} style={{ display: 'contents' }}>
      {children}
    </div>
  )
}

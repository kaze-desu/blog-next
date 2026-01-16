'use client'
import React, { useMemo } from 'react'
import { renderToString } from 'katex'
import 'katex/dist/katex.min.css'

// Regex to match $...$ but not $$...$$ (display math)
const INLINE_MATH_REGEX = /(?<!\$)\$([^$\n]+)\$(?!\$)/g

// Component that renders a single inline math formula
export function InlineMath({ formula }: { formula: string }) {
  const html = useMemo(() => {
    try {
      return renderToString(formula, {
        throwOnError: false,
        displayMode: false,
        output: 'html',
      })
    } catch {
      return null
    }
  }, [formula])

  if (!html) {
    return <span>${formula}$</span>
  }

  return (
    <span
      className="inline-math"
      data-formula={formula}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// Process a string and return React elements with inline math rendered
export function processTextWithMath(text: string): React.ReactNode {
  // Quick check - if no $ signs, return as-is
  if (!text.includes('$')) {
    return text
  }

  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let keyIndex = 0

  // Reset regex state
  INLINE_MATH_REGEX.lastIndex = 0

  while ((match = INLINE_MATH_REGEX.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    // Add the math formula as a React component
    const formula = match[1].trim()
    if (formula) {
      parts.push(<InlineMath key={`math-${keyIndex++}`} formula={formula} />)
    } else {
      // Empty formula, keep original
      parts.push(match[0])
    }

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  // If we only have one part and it's the original text, return it
  if (parts.length === 1 && parts[0] === text) {
    return text
  }

  // Return array of parts (React will render them correctly)
  return parts.length > 0 ? <>{parts}</> : text
}

import { renderToString } from 'katex'

// Regex to match $...$ but not $$...$$ (display math)
const INLINE_MATH_REGEX = /(?<!\$)\$([^$\n]+)\$(?!\$)/g

// Helper to escape HTML
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Server-safe function to process text with inline math
// Returns HTML string that can be used with dangerouslySetInnerHTML
export function processTextWithMathServer(text: string): string {
  // Quick check - if no $ signs, return as-is
  if (!text.includes('$')) {
    return text
  }

  const parts: string[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  // Reset regex state
  INLINE_MATH_REGEX.lastIndex = 0

  while ((match = INLINE_MATH_REGEX.exec(text)) !== null) {
    // Add text before the match (escape HTML)
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index)
      parts.push(escapeHtml(beforeText))
    }

    // Render the math formula as HTML
    const formula = match[1].trim()
    if (formula) {
      try {
        const html = renderToString(formula, {
          throwOnError: false,
          displayMode: false,
          output: 'html',
        })
        parts.push(
          `<span class="inline-math" data-formula="${escapeHtml(formula)}">${html}</span>`,
        )
      } catch {
        // If rendering fails, keep original
        parts.push(escapeHtml(match[0]))
      }
    } else {
      // Empty formula, keep original
      parts.push(escapeHtml(match[0]))
    }

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(escapeHtml(text.substring(lastIndex)))
  }

  return parts.join('')
}

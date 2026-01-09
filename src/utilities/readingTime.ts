const WORDS_PER_MINUTE = 200

function extractTextFromLexicalNode(node: unknown, parts: string[]) {
  if (!node || typeof node !== 'object') return

  const maybeText = (node as { text?: unknown }).text
  if (typeof maybeText === 'string' && maybeText.trim()) {
    parts.push(maybeText)
  }

  const children = (node as { children?: unknown }).children
  if (Array.isArray(children)) {
    for (const child of children) extractTextFromLexicalNode(child, parts)
  }
}

export function lexicalToPlainText(editorState: unknown): string {
  const parts: string[] = []

  // Payload Lexical editor state typically looks like: { root: { children: [...] } }
  if (editorState && typeof editorState === 'object' && 'root' in editorState) {
    extractTextFromLexicalNode((editorState as { root?: unknown }).root, parts)
  } else {
    extractTextFromLexicalNode(editorState, parts)
  }

  return parts.join(' ')
}

export function readingTimeFromText(text: string): string {
  const words = text
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length

  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE))
  return `${minutes} min read`
}

export function readingTimeFromLexical(editorState: unknown): string {
  return readingTimeFromText(lexicalToPlainText(editorState))
}

export function readingTimeFromWordCount(wordCount: number): string {
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200))
  return `${readingTimeMinutes} min read`
}

function collectTextFromUnknown(node: unknown, parts: string[]) {
  if (!node || typeof node !== 'object') return

  const anyNode = node as Record<string, unknown>

  // Lexical text nodes commonly include a `text` property
  const text = anyNode.text
  if (typeof text === 'string') {
    parts.push(text)
  }

  // Many nodes contain nested children arrays
  const children = anyNode.children
  if (Array.isArray(children)) {
    for (const child of children) collectTextFromUnknown(child, parts)
  }
}

/**
 * Best-effort word count for Payload Lexical editor state.
 * We traverse the object tree looking for `text` fields and children arrays.
 */
export function lexicalWordCount(editorState: unknown): number {
  if (!editorState || typeof editorState !== 'object') return 0

  const root = (editorState as { root?: unknown }).root
  if (!root) return 0

  const parts: string[] = []
  collectTextFromUnknown(root, parts)
  const text = parts.join(' ')

  return text
    .replace(/\u00A0/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
}



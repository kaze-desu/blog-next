'use client'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="relative z-20 h-full px-3 hover:bg-[#e1e4e8] dark:hover:bg-[#21262d] flex items-center justify-center transition-all cursor-pointer pointer-events-auto"
      aria-label={copied ? 'Copied' : 'Copy code'}
      title={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-[#656d76] dark:text-[#8b949e]" />
      )}
    </button>
  )
}

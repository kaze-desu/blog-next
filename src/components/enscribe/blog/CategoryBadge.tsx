import { cn } from '@/utilities/ui'
import {
  Code,
  Eye,
  Globe,
  Hash,
  Key,
  Link2,
  Puzzle,
  RotateCcw,
  Search,
  Zap,
} from 'lucide-react'
import React from 'react'

function getCategoryStyle(label: string): { className: string; Icon: React.FC<{ className?: string }> } | null {
  const lower = label.toLowerCase()

  if (lower.includes('crypto')) {
    return { className: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-200', Icon: Key }
  }
  if (lower.includes('web')) {
    return { className: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-200', Icon: Globe }
  }
  if (lower.includes('reverse') || lower.includes('rev')) {
    return {
      className: 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-200',
      Icon: RotateCcw,
    }
  }
  if (lower.includes('pwn') || lower.includes('binary exploitation')) {
    return { className: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-200', Icon: Zap }
  }
  if (lower.includes('misc')) {
    return { className: 'bg-stone-50 text-stone-700 dark:bg-stone-950/30 dark:text-stone-200', Icon: Puzzle }
  }
  if (lower.includes('forensic')) {
    return { className: 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-200', Icon: Search }
  }
  if (lower.includes('osint')) {
    return { className: 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-200', Icon: Eye }
  }
  if (lower.includes('blockchain')) {
    return { className: 'bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-200', Icon: Link2 }
  }
  if (lower.includes('ppc') || lower.includes('programming')) {
    return { className: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-200', Icon: Code }
  }

  return null
}

export function CategoryBadge({
  label,
  className,
  showIcon = true,
}: {
  label: string
  className?: string
  showIcon?: boolean
}) {
  const style = getCategoryStyle(label)
  const IconToUse = style?.Icon ?? Hash

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs',
        style?.className ?? 'bg-secondary text-secondary-foreground',
        className,
      )}
    >
      {showIcon && <IconToUse className="h-3 w-3" />}
      <span>{label}</span>
    </span>
  )
}



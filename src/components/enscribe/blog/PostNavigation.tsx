import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type NavPost = {
  slug: string
  title: string
}

export function PostNavigation({
  olderPost,
  newerPost,
}: {
  olderPost?: NavPost | null
  newerPost?: NavPost | null
}) {
  return (
    <nav className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Link
        aria-disabled={!olderPost}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'group flex size-full items-center justify-start',
          !olderPost && 'pointer-events-none cursor-not-allowed opacity-50',
        )}
        href={olderPost ? `/posts/${olderPost.slug}#post-title` : '#'}
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <div className="flex flex-col items-start overflow-hidden text-wrap">
          <span className="text-muted-foreground text-left text-xs">Previous Post</span>
          <span className="w-full text-left text-balance text-ellipsis text-sm">
            {olderPost?.title || "You're at the oldest post!"}
          </span>
        </div>
      </Link>

      <Link
        aria-disabled={!newerPost}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'group flex size-full items-center justify-end',
          !newerPost && 'pointer-events-none cursor-not-allowed opacity-50',
        )}
        href={newerPost ? `/posts/${newerPost.slug}#post-title` : '#'}
      >
        <div className="flex flex-col items-end overflow-hidden text-wrap">
          <span className="text-muted-foreground text-right text-xs">Next Post</span>
          <span className="w-full text-right text-balance text-ellipsis text-sm">
            {newerPost?.title || "You're at the newest post!"}
          </span>
        </div>
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </nav>
  )
}



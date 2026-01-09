import { cn } from '@/utilities/ui'
import React from 'react'

import { EnscribeFooter } from './EnscribeFooter'
import { EnscribeHeader } from './EnscribeHeader'

type Props = {
  children: React.ReactNode
  className?: string
}

export async function EnscribeShell({ children, className }: Props) {
  return (
    <div className={cn('flex h-fit min-h-screen flex-col gap-y-6 font-mono', className)}>
      <div className="sticky top-0 z-50 divide-y bg-background/50 backdrop-blur-sm xl:divide-none">
        <EnscribeHeader />
      </div>

      <main className="grow">
        <div className="mx-auto flex w-full grow flex-col gap-y-6 px-4">{children}</div>
      </main>

      <EnscribeFooter />
    </div>
  )
}



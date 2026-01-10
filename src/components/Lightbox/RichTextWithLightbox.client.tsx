'use client'

import React, { useEffect, useRef } from 'react'
import RichText from '@/components/RichText'
import { LightboxProvider } from './LightboxProvider.client'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export function RichTextWithLightbox(props: Props) {
  return (
    <LightboxProvider>
      <RichText {...props} />
    </LightboxProvider>
  )
}

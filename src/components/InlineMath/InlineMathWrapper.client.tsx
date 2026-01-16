'use client'
import React from 'react'

type Props = {
  html: string
}

export function InlineMathWrapper({ html }: Props) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

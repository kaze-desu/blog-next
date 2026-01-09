import type { Header as HeaderType } from '@/payload-types'

import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { EnscribeHeaderClient } from './EnscribeHeader.client'

export async function EnscribeHeader() {
  const headerData: HeaderType = await getCachedGlobal('header', 1)()

  return <EnscribeHeaderClient data={headerData} />
}



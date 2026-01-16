import type { Block } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineCodeFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { Code } from '../Code/config'
import { MediaBlock } from '../MediaBlock/config'

// Helper function to get banner content blocks
// Note: Banner is not included here to avoid circular dependency during schema generation.
// Nested banners will still render correctly on the frontend because the main RichText component handles all registered blocks.
const getBannerContentBlocks = (): Block[] => [Code, MediaBlock]

export const Banner: Block = {
  slug: 'banner',
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Note', value: 'note' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Success', value: 'success' },
        { label: 'Tip', value: 'tip' },
        { label: 'Important', value: 'important' },
        { label: 'Question', value: 'question' },
        { label: 'Info', value: 'info' },
      ],
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Optional custom title. If empty, the banner type name will be used.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => {
          return [
            ...defaultFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            BlocksFeature({
              blocks: getBannerContentBlocks(),
            }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            OrderedListFeature(), // Numbered lists with nesting support
            UnorderedListFeature(), // Bullet lists with nesting support
            InlineCodeFeature(), // Inline code styling
          ]
        },
      }),
      label: false,
      required: true,
    },
  ],
  interfaceName: 'BannerBlock',
}

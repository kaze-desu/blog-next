import type { Block } from 'payload'

export const HomeLayout: Block = {
  slug: 'homeLayout',
  interfaceName: 'HomeLayoutBlock',
  fields: [
    {
      name: 'intro',
      type: 'group',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
        },
        {
          name: 'titlePrefix',
          type: 'text',
        },
        {
          name: 'titleHighlight',
          type: 'text',
        },
        {
          name: 'titleSuffix',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'friends',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
            {
              name: 'newTab',
              type: 'checkbox',
              defaultValue: true,
              label: 'Open in new tab',
            },
          ],
        },
      ],
    },
  ],
}

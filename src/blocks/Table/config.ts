import type { Block } from 'payload'

export const Table: Block = {
  slug: 'table',
  interfaceName: 'TableBlock',
  fields: [
    {
      name: 'headers',
      type: 'array',
      label: 'Table Headers',
      minRows: 1,
      fields: [
        {
          name: 'header',
          type: 'text',
          required: true,
          label: 'Header Text',
        },
      ],
      admin: {
        description: 'Define the column headers for the table.',
      },
    },
    {
      name: 'rows',
      type: 'array',
      label: 'Table Rows',
      fields: [
        {
          name: 'cells',
          type: 'array',
          label: 'Row Cells',
          fields: [
            {
              name: 'content',
              type: 'text',
              required: true,
              label: 'Cell Content',
            },
          ],
          admin: {
            description: 'Add cells for this row. The number of cells should match the number of headers.',
          },
        },
      ],
      admin: {
        description: 'Add rows to the table. Each row should have the same number of cells as headers.',
      },
    },
  ],
  labels: {
    singular: 'Table',
    plural: 'Tables',
  },
}

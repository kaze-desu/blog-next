import type { Block } from 'payload'

export const Math: Block = {
  slug: 'math',
  interfaceName: 'MathBlock',
  fields: [
    {
      name: 'formula',
      type: 'textarea',
      label: 'LaTeX Formula',
      required: true,
      admin: {
        description: 'Enter LaTeX formula for display math (block).',
      },
    },
  ],
}

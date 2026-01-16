import type { Block } from 'payload'

export const Mermaid: Block = {
  slug: 'mermaid',
  interfaceName: 'MermaidBlock',
  fields: [
    {
      name: 'diagram',
      type: 'code',
      label: 'Mermaid Diagram',
      required: true,
      admin: {
        description: 'Enter Mermaid diagram code (flowchart, sequence diagram, etc.).',
        language: 'text',
      },
    },
  ],
}

import type { Block } from 'payload'

export const Code: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      options: [
        {
          label: 'Typescript',
          value: 'typescript',
        },
        {
          label: 'Javascript',
          value: 'javascript',
        },
        {
          label: 'CSS',
          value: 'css',
        },
        {
          label: 'HTML',
          value: 'html',
        },
        {
          label: 'JSON',
          value: 'json',
        },
        {
          label: 'Python',
          value: 'python',
        },
        {
          label: 'Java',
          value: 'java',
        },
        {
          label: 'C++',
          value: 'cpp',
        },
        {
          label: 'C',
          value: 'c',
        },
        {
          label: 'C#',
          value: 'csharp',
        },
        {
          label: 'Go',
          value: 'go',
        },
        {
          label: 'Rust',
          value: 'rust',
        },
        {
          label: 'Ruby',
          value: 'ruby',
        },
        {
          label: 'PHP',
          value: 'php',
        },
        {
          label: 'Swift',
          value: 'swift',
        },
        {
          label: 'Kotlin',
          value: 'kotlin',
        },
        {
          label: 'Scala',
          value: 'scala',
        },
        {
          label: 'Shell',
          value: 'bash',
        },
        {
          label: 'SQL',
          value: 'sql',
        },
        {
          label: 'YAML',
          value: 'yaml',
        },
        {
          label: 'Markdown',
          value: 'markdown',
        },
        {
          label: 'GraphQL',
          value: 'graphql',
        },
        {
          label: 'Dockerfile',
          value: 'docker',
        },
        {
          label: 'Diff',
          value: 'diff',
        },
      ],
    },
    {
      name: 'code',
      type: 'code',
      label: false,
      required: true,
    },
  ],
}

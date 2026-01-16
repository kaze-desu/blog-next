import React from 'react'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'
import { MathBlock, MathBlockProps } from '@/blocks/Math/Component'
import { MermaidBlock, MermaidBlockProps } from '@/blocks/Mermaid/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { processTextWithMathServer } from '@/components/InlineMath/processTextWithMath'
import { cn } from '@/utilities/ui'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | CTABlockProps
      | MediaBlockProps
      | BannerBlockProps
      | CodeBlockProps
      | MathBlockProps
      | MermaidBlockProps
    >

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  // Custom text converter that processes inline math $...$ and preserves inline code formatting
  text: (args) => {
    const { node } = args
    const text = node.text

    // Check if this text node has code formatting (inline code)
    // In Lexical, code formatting is stored in the format property as a bitmask
    // Format 1 = code, format 2 = bold, format 4 = italic, etc.
    const nodeAny = node as any
    const format = nodeAny.format

    // Try multiple ways to detect code formatting
    // In Lexical, format is a bitmask: 1 = code, 2 = bold, 4 = italic, 8 = underline, etc.
    const hasCodeFormat =
      (typeof format === 'number' && (format & 1) === 1) || nodeAny.code === true || format === 1

    // Process inline math in the text (server-safe, returns HTML string)
    const html = processTextWithMathServer(text)
    const hasInlineMath = html !== text

    // If text has code formatting, wrap in <code> tag
    if (hasCodeFormat) {
      // Process inline math in the text
      if (hasInlineMath) {
        return React.createElement('code', {
          dangerouslySetInnerHTML: { __html: html },
        })
      }
      // Otherwise, just wrap the text in a code tag
      return React.createElement('code', {}, text)
    }

    // No code formatting - process inline math if present
    if (hasInlineMath) {
      return React.createElement('span', {
        dangerouslySetInnerHTML: { __html: html },
      })
    }

    // No special processing needed - use default converter to handle formatting
    // This preserves bold, italic, underline, AND inline code from default converters
    const defaultTextConverter = defaultConverters.text
    if (typeof defaultTextConverter === 'function') {
      try {
        return defaultTextConverter(args)
      } catch (error) {
        // If default converter fails, fall back to plain text
        console.warn('[RichText] Default text converter failed:', error)
        return text
      }
    }

    // Fallback to plain text
    return text
  },
  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    // Legacy converter for old callout blocks - convert to banner
    callout: ({ node }: { node: { fields: any } }) => {
      const fields = node.fields as any
      // Map old callout type to banner style (they're the same values)
      const style = fields.type || 'note'
      return (
        <BannerBlock
          className="col-start-2 mb-4"
          style={style}
          title={fields.title}
          content={fields.content}
          blockType="banner"
        />
      )
    },
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
    math: ({ node }) => <MathBlock className="col-start-2" {...node.fields} />,
    mermaid: ({ node }) => <MermaidBlock className="col-start-2" {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, data, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      data={data}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}

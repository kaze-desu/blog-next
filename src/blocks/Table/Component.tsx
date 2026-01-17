import React from 'react'

import type { TableBlock as TableBlockType } from '@/payload-types'
import { processTextWithMathServer } from '@/components/InlineMath/processTextWithMath'

export type TableBlockProps = TableBlockType & {
  blockType: 'table'
}

type Props = TableBlockProps & {
  className?: string
}

export const TableBlock: React.FC<Props> = ({ className, headers, rows }) => {
  if (!headers || headers.length === 0) {
    return null
  }

  return (
    <div className={[className, 'not-prose'].filter(Boolean).join(' ')}>
      <div className="overflow-x-auto rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-white dark:bg-[#0d1117] overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {headers.map((header, index) => {
                const headerText = header?.header || ''
                const processedHeader = processTextWithMathServer(headerText)
                const hasMath = processedHeader !== headerText

                return (
                  <th
                    key={index}
                    className="border-b-2 border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#161b22] px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#57606a] dark:text-[#8b949e]"
                  >
                    {hasMath ? (
                      <span dangerouslySetInnerHTML={{ __html: processedHeader }} />
                    ) : (
                      headerText
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#0d1117] divide-y divide-[#d0d7de]/50 dark:divide-[#21262d]/50">
            {rows && rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="bg-white dark:bg-[#0d1117] hover:bg-[#f6f8fa] dark:hover:bg-[#161b22] transition-colors duration-150"
                >
                  {row?.cells?.map((cell, cellIndex) => {
                    const cellContent = cell?.content || ''
                    const processedContent = processTextWithMathServer(cellContent)
                    const hasMath = processedContent !== cellContent

                    return (
                      <td
                        key={cellIndex}
                        className="px-5 py-3.5 text-sm leading-relaxed text-[#24292f] dark:text-[#e6edf3]"
                      >
                        {hasMath ? (
                          <span dangerouslySetInnerHTML={{ __html: processedContent }} />
                        ) : (
                          cellContent
                        )}
                      </td>
                    )
                  })}
                  {/* Fill empty cells if row has fewer cells than headers */}
                  {row?.cells && row.cells.length < headers.length
                    ? Array.from({ length: headers.length - row.cells.length }).map((_, index) => (
                        <td key={`empty-${index}`} className="px-5 py-3.5"></td>
                      ))
                    : null}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-5 py-12 text-center text-sm text-[#656d76] dark:text-[#8b949e] italic"
                >
                  No rows added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

'use client'
import { Highlight, themes } from 'prism-react-renderer'
import React, { useEffect, useState } from 'react'
import { CopyButton } from './CopyButton'

type Props = {
  code: string
  language?: string
  title?: string
}

export const Code: React.FC<Props> = ({ code, language = '', title }) => {
  // Use useState to avoid hydration errors - start with light theme (default)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check theme after hydration
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      setIsDark(theme === 'dark')
    }

    checkTheme()

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  if (!code) return null

  const baseTheme = isDark ? themes.vsDark : themes.vsLight

  // Remove textShadow from theme to prevent inline styles
  const themeWithoutShadow = {
    ...baseTheme,
    plain: {
      ...baseTheme.plain,
      textShadow: undefined,
    },
    styles: baseTheme.styles?.map((style) => ({
      ...style,
      style: {
        ...style.style,
        textShadow: undefined,
      },
    })),
  }

  return (
    <Highlight code={code} language={language} theme={themeWithoutShadow}>
      {({ getLineProps, getTokenProps, tokens }) => (
        <div className="group relative rounded-lg border border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa] dark:bg-[#161b22] overflow-hidden">
          {/* Top bar with language indicator, title, and copy button */}
          <div className="relative flex items-center px-3 py-1.5 border-b border-[#d0d7de] dark:border-[#30363d] bg-[#f0f2f5] dark:bg-[#0d1117] h-8">
            {/* Language indicator on the absolute left */}
            {language && (
              <div className="absolute left-3 px-2 py-0.5 text-[10px] font-medium text-[#656d76] dark:text-[#8b949e] bg-white/60 dark:bg-[#21262d]/60 backdrop-blur-sm rounded-full uppercase">
                {language}
              </div>
            )}
            {/* Title in the center */}
            {title && (
              <div className="absolute left-1/2 -translate-x-1/2 px-2 py-0.5 text-[11px] font-medium text-[#656d76] dark:text-[#8b949e] bg-white/60 dark:bg-[#21262d]/60 backdrop-blur-sm rounded-full truncate max-w-[60%]">
                {title}
              </div>
            )}
            {/* Copy button on the absolute right - integrated into bar */}
            <div className="absolute right-0">
              <CopyButton code={code} />
            </div>
          )}
          <pre className="font-mono text-sm overflow-x-auto relative py-4">
            {/* Full-height border positioned relative to pre */}
            <div className="absolute top-0 bottom-0 left-[2.5rem] w-px bg-[#d0d7de] dark:bg-[#30363d] pointer-events-none"></div>
            <div className="flex">
              {/* Line numbers column with darker background */}
              <div className="flex-shrink-0 w-10 text-center select-none text-[#8c959f] dark:text-[#6e7681] bg-[#f0f2f5] dark:bg-[#0d1117] mr-4 -my-4 py-4">
                {tokens.map((_, i) => (
                  <div key={i} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>
              {/* Code content column */}
              <div className="flex-1 min-w-0 pr-4">
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })} className="leading-6">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </pre>
        </div>
      )}
    </Highlight>
  )
}

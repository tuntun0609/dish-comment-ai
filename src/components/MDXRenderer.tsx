'use client'

import { useState, useEffect, useMemo } from 'react'
import * as runtime from 'react/jsx-dev-runtime'
import { evaluate } from '@mdx-js/mdx'
import { MDXProvider } from '@mdx-js/react'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

import { ErrorBoundary } from './ErrorBoundary'

import 'katex/dist/katex.min.css'

import type { MDXComponents } from 'mdx/types'

interface MDXRendererProps {
  content: string
}

// 未知组件的 props 类型
type UnknownComponentProps = {
  children?: React.ReactNode
  [key: string]: any
}

export default function MDXRenderer({ content }: MDXRendererProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fallback 组件用于处理未知的组件
  const FallbackComponent = ({ children, ...props }: UnknownComponentProps) => {
    const componentName = props?.['data-origin-component'] || 'unknown'
    console.warn(`未知组件被降级处理: ${componentName}`)
    return <div {...props}>{children}</div>
  }

  const components: MDXComponents = useMemo(
    () => ({
      // 这里可以添加自定义组件
      h1: (props: any) => <h1 className="my-4 text-3xl font-bold" {...props} />,
      h2: (props: any) => <h2 className="my-3 text-2xl font-semibold" {...props} />,
      p: (props: any) => <p className="my-2" {...props} />,
      FallbackComponent,
    }),
    []
  )

  useEffect(() => {
    async function compileMDX() {
      try {
        const { default: MDXContent } = await evaluate(content, {
          ...runtime,
          development: true, // 启用开发模式以获得更好的错误信息
          baseUrl: window.location.href,
          useMDXComponents: () => components,
          format: 'mdx',
          remarkPlugins: [remarkMath],
          rehypePlugins: [
            [
              rehypeKatex,
              {
                strict: false,
              },
            ],
            () => tree => {
              // 遍历并标记未知组件
              function visit(node: any) {
                if (node.type === 'mdxJsxFlowElement' && !components[node.name]) {
                  node.properties = node.properties || {}

                  node.attributes.push({
                    type: 'mdxJsxAttribute',
                    name: 'data-origin-component',
                    value: node.name,
                  })

                  node.name = 'FallbackComponent'
                }
                if (node.children) {
                  node.children.forEach(visit)
                }
              }
              visit(tree)
              return tree
            },
          ],
        })
        setComponent(() => MDXContent)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to compile MDX')
        setComponent(null)
      }
    }

    compileMDX()
  }, [content, components])

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!Component) {
    return <div>Loading...</div>
  }

  return (
    <ErrorBoundary>
      <MDXProvider components={components}>
        <Component />
      </MDXProvider>
    </ErrorBoundary>
  )
}

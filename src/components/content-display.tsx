'use client'

import { useState } from 'react'
import { Copy } from 'lucide-react'

interface ContentDisplayProps {
  content: string
  className?: string
}

export const ContentDisplay = ({ content, className = '' }: ContentDisplayProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div
      className={`relative mx-auto mt-8 max-w-3xl rounded-lg border border-gray-200 bg-white p-4 ${className}`}
    >
      <div className="mt-6 mb-2 text-sm break-words whitespace-pre-wrap text-gray-800">
        {content}
      </div>
      <div className="text-right text-sm text-gray-500">字数:{content.length}</div>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        title="复制内容"
      >
        <Copy className="h-4 w-4" />
      </button>
      {copied && (
        <div className="absolute top-2 right-2 rounded-md bg-black px-2 py-1 text-xs text-white">
          已复制
        </div>
      )}
    </div>
  )
}

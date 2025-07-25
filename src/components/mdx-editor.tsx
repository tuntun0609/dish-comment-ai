'use client'
import type { ForwardedRef } from 'react'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  diffSourcePlugin,
} from '@mdxeditor/editor'

export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef?: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        // Example Plugin Usage
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        diffSourcePlugin({
          viewMode: 'source',
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  )
}

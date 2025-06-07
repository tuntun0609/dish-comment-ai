import YAML from 'yaml'

import type { MDXParseOptions, MDXFrontmatter, MDXSection, MDXParseResult } from '@/types/mdx'

/**
 * 解析 frontmatter 部分
 */
function parseFrontmatter(code: string, options: MDXParseOptions = {}) {
  let frontmatterRaw: string | undefined
  let content = code

  // 匹配 --- 包围的 frontmatter
  const frontmatterMatch = code.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/m)

  if (frontmatterMatch) {
    frontmatterRaw = frontmatterMatch[1]
    content = frontmatterMatch[2] || ''
  }

  let frontmatter: MDXFrontmatter = {}

  if (frontmatterRaw && !options.noParseYAML) {
    try {
      const doc = YAML.parseDocument(frontmatterRaw)
      frontmatter = doc.toJSON() || {}
    } catch (error) {
      console.warn('Failed to parse YAML frontmatter:', error)
    }
  }

  return {
    frontmatter,
    frontmatterRaw,
    content: content.trim(),
  }
}

/**
 * 解析单个 MDX 部分
 */
function parseSection(
  raw: string,
  index: number,
  start: number,
  end: number,
  options: MDXParseOptions = {}
): MDXSection {
  const { frontmatter, frontmatterRaw, content } = parseFrontmatter(raw, options)

  return {
    index,
    frontmatter,
    frontmatterRaw,
    content,
    raw,
    start,
    end,
  }
}

/**
 * 解析 MDX 字符串，将单独的 --- 或者 Frontmatter 作为拆分点
 * @param mdx MDX 字符串
 * @param options 解析选项
 * @returns 解析结果
 */
export function parseMDX(mdx: string, options: MDXParseOptions = {}): MDXParseResult {
  const lines = mdx.split(options.preserveCR ? '\n' : /\r?\n/g)
  const sections: MDXSection[] = []
  let start = 0

  /**
   * 创建一个新的部分
   */
  function createSection(end: number) {
    if (start === end) return

    const raw = lines.slice(start, end).join('\n')
    const section = parseSection(raw, sections.length, start, end, options)
    sections.push(section)
    start = end + 1
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd()

    // 检测到分隔符 ---
    if (line.startsWith('---')) {
      // 如果不是第一行，先创建前面的部分
      if (i > 0) {
        createSection(i)
      }

      const next = lines[i + 1]

      // 检查是否是 frontmatter 开始
      if (line === '---' && next?.trim()) {
        start = i
        // 寻找 frontmatter 结束的 ---
        for (i += 1; i < lines.length; i++) {
          if (lines[i].trimEnd() === '---') {
            // 包含结束的 --- 行
            i++
            break
          }
        }
      } else {
        // 单独的分隔符，开始新的部分
        start = i + 1
      }
    }
    // 跳过代码块中的 ---
    else if (line.trimStart().startsWith('```')) {
      const codeBlockLevel = line.match(/^\s*`+/)![0]
      let j = i + 1
      for (; j < lines.length; j++) {
        if (lines[j].startsWith(codeBlockLevel)) {
          break
        }
      }
      // 只有在找到代码块结束时才更新 i
      if (j !== lines.length) {
        i = j
      }
    }
  }

  // 处理最后一部分
  if (start <= lines.length - 1) {
    createSection(lines.length)
  }

  return {
    sections,
    raw: mdx,
  }
}

/**
 * 同步版本的 MDX 解析器
 */
export function parseMDXSync(mdx: string, options: MDXParseOptions = {}): MDXParseResult {
  return parseMDX(mdx, options)
}

/**
 * 将解析结果重新组合成 MDX 字符串
 */
export function stringifyMDX(result: MDXParseResult): string {
  return `${result.sections
    .map(section => section.raw)
    .join('\n---\n')
    .trim()}\n`
}

/**
 * 美化 MDX 部分
 */
export function prettifyMDXSection(section: MDXSection): MDXSection {
  const trimmedContent = section.content.trim()
  section.content = trimmedContent ? `\n${trimmedContent}\n` : ''

  if (section.frontmatterRaw) {
    section.raw = `---\n${section.frontmatterRaw.trim()}\n---\n${section.content}`
  } else {
    section.raw = section.content
  }

  return section
}

/**
 * 美化整个 MDX 解析结果
 */
export function prettifyMDX(result: MDXParseResult): MDXParseResult {
  result.sections.forEach(prettifyMDXSection)
  return result
}

import { parseMDX, stringifyMDX, prettifyMDX } from './index'

// 示例 MDX 内容
const exampleMDX = `---
title: "第一部分"
author: "作者"
date: "2024-01-01"
---

# 第一部分内容

这是第一部分的 markdown 内容。

## 子标题

一些内容...

---

# 第二部分

这是没有 frontmatter 的部分。

---
title: "第三部分"
tags: ["tag1", "tag2"]
---

# 第三部分内容

这里有 frontmatter 和内容。

\`\`\`javascript
// 代码块中的 --- 应该被忽略
const config = {
  separator: '---'
}
\`\`\``

/**
 * 演示解析器的使用
 */
export function demonstrateParser() {
  console.log('=== 原始 MDX 内容 ===')
  console.log(exampleMDX)

  console.log('\n=== 解析结果 ===')
  const result = parseMDX(exampleMDX)

  console.log(`找到 ${result.sections.length} 个部分:`)

  result.sections.forEach((section, index) => {
    console.log(`\n--- 第 ${index + 1} 部分 ---`)
    console.log('Frontmatter:', section.frontmatter)
    console.log(
      '内容:',
      section.content.substring(0, 100) + (section.content.length > 100 ? '...' : '')
    )
    console.log('行范围:', `${section.start} - ${section.end}`)
  })

  console.log('\n=== 重新组合的 MDX ===')
  const stringified = stringifyMDX(result)
  console.log(stringified)

  console.log('\n=== 美化后的结果 ===')
  const prettified = prettifyMDX(result)
  console.log(stringifyMDX(prettified))
}

// 如果直接运行此文件，执行演示
if (typeof require !== 'undefined' && require.main === module) {
  demonstrateParser()
}

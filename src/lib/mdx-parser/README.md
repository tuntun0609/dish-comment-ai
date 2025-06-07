# MDX 解析器

基于 Slidev 的 parse 函数实现的 MDX 字符串解析器，支持将 MDX 内容按照 `---` 分隔符或 frontmatter 拆分成多个部分。

## 功能特性

- 🔍 **智能分割**：自动识别 `---` 分隔符和 frontmatter 边界
- 📝 **Frontmatter 解析**：支持 YAML 格式的 frontmatter 解析
- 🧩 **代码块保护**：忽略代码块内的分隔符
- 🎨 **美化功能**：提供内容格式化功能
- ⚡ **高性能**：基于逐行解析，性能优秀

## API 说明

### 主要函数

#### `parseMDX(mdx: string, options?: MDXParseOptions): MDXParseResult`

解析 MDX 字符串，返回包含所有部分的结果。

**参数：**
- `mdx`: 要解析的 MDX 字符串
- `options`: 可选的解析选项
  - `noParseYAML?: boolean` - 是否跳过 YAML 解析
  - `preserveCR?: boolean` - 是否保留回车符

**返回：**
```typescript
interface MDXParseResult {
  sections: MDXSection[]
  raw: string
}
```

#### `stringifyMDX(result: MDXParseResult): string`

将解析结果重新组合成 MDX 字符串。

#### `prettifyMDX(result: MDXParseResult): MDXParseResult`

美化解析结果，规范化格式。

### 数据类型

```typescript
interface MDXSection {
  index: number              // 部分索引
  frontmatter: MDXFrontmatter // 解析后的 frontmatter 对象
  frontmatterRaw?: string    // 原始 frontmatter 字符串
  content: string            // markdown 内容
  raw: string               // 原始字符串
  start: number             // 起始行号
  end: number               // 结束行号
}

interface MDXFrontmatter {
  [key: string]: any
}
```

## 使用示例

```typescript
import { parseMDX, stringifyMDX, prettifyMDX } from '@/lib/mdx-parser'

const mdxContent = `---
title: "我的文章"
author: "作者"
date: "2024-01-01"
---

# 第一部分

这是第一部分的内容。

---

# 第二部分

这是第二部分的内容，没有 frontmatter。

---
title: "第三部分"
tags: ["tag1", "tag2"]
---

# 第三部分

这是第三部分的内容。
`

// 解析 MDX
const result = parseMDX(mdxContent)

console.log(`找到 ${result.sections.length} 个部分`)

// 遍历每个部分
result.sections.forEach((section, index) => {
  console.log(`第 ${index + 1} 部分:`)
  console.log('- Frontmatter:', section.frontmatter)
  console.log('- 内容:', section.content.substring(0, 50) + '...')
})

// 重新组合
const reassembled = stringifyMDX(result)

// 美化格式
const prettified = prettifyMDX(result)
```

## 解析规则

1. **分隔符识别**：
   - 以 `---` 开头的行被视为分隔符
   - 区分 frontmatter 边界和普通分隔符

2. **Frontmatter 处理**：
   - 支持 YAML 格式的 frontmatter
   - 自动解析为 JavaScript 对象

3. **代码块保护**：
   - 自动跳过代码块（```）内的内容
   - 避免误识别代码中的分隔符

4. **内容提取**：
   - 保留原始格式
   - 提供行号信息
   - 支持内容重组

## 注意事项

- 确保项目中已安装 `yaml` 依赖
- frontmatter 必须位于文档顶部或分隔符之后
- 代码块内的 `---` 会被正确忽略
- 支持多种换行符格式（LF/CRLF） 
export interface MDXParseOptions {
  noParseYAML?: boolean
  preserveCR?: boolean
}

export interface MDXFrontmatter {
  [key: string]: any
}

export interface MDXSection {
  index: number
  frontmatter: MDXFrontmatter
  frontmatterRaw?: string
  content: string
  raw: string
  start: number
  end: number
}

export interface MDXParseResult {
  sections: MDXSection[]
  raw: string
}

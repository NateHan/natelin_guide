import { marked } from 'marked'

// Ensure marked always returns synchronously
marked.use({ async: false })

// Browser-safe frontmatter parser — gray-matter uses Node's Buffer and can't run in browser.
// Our YAML is simple key: value pairs, so a regex parser is sufficient.
function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    const value = line.slice(colonIdx + 1).trim()
    if (key) data[key] = value
  }

  return { data, content: match[2] }
}

export interface CityMeta {
  title: string
  country: string
  visited?: string
  hero_image?: string
  tagline?: string
  slug: string
}

export interface Spot {
  name: string
  html: string
}

export interface CitySection {
  id: string
  label: string
  spots: Spot[]
  introHtml: string
}

export interface ParsedCity {
  meta: CityMeta
  sections: CitySection[]
}

// Canonical display order for sections
const SECTION_ORDER = ['eat', 'coffee', 'drink', 'do', 'tips']

function mdToHtml(src: string): string {
  return marked.parse(src) as string
}

function parseSection(label: string, rawContent: string): CitySection {
  const id = label.toLowerCase().replace(/\s+/g, '-')
  const spotRegex = /^### (.+)$/gm
  const matches = [...rawContent.matchAll(spotRegex)]

  let introHtml = ''
  const spots: Spot[] = []

  if (matches.length === 0) {
    // No ### headings — render the whole thing (e.g. Tips bullet list)
    introHtml = mdToHtml(rawContent.trim())
    return { id, label, spots, introHtml }
  }

  // Prose before the first ### heading
  if (matches[0].index! > 0) {
    introHtml = mdToHtml(rawContent.slice(0, matches[0].index!).trim())
  }

  matches.forEach((match, i) => {
    const name = match[1].trim()
    const start = match.index! + match[0].length
    const end = matches[i + 1]?.index ?? rawContent.length
    const html = mdToHtml(rawContent.slice(start, end).trim())
    spots.push({ name, html })
  })

  return { id, label, spots, introHtml }
}

export function parseCity(raw: string, slug: string): ParsedCity {
  const { data, content } = parseFrontmatter(raw)

  const meta: CityMeta = {
    title: data.title ?? slug,
    country: data.country ?? '',
    visited: data.visited ?? undefined,
    hero_image: data.hero_image ?? undefined,
    tagline: data.tagline ?? undefined,
    slug,
  }

  // Split body into sections by ## headings
  const sectionRegex = /^## (.+)$/gm
  const sectionMatches = [...content.matchAll(sectionRegex)]

  const sections: CitySection[] = sectionMatches.map((match, i) => {
    const label = match[1].trim()
    const start = match.index! + match[0].length
    const end = sectionMatches[i + 1]?.index ?? content.length
    return parseSection(label, content.slice(start, end).trim())
  })

  // Sort sections into canonical order; unknown sections go at the end
  sections.sort((a, b) => {
    const ai = SECTION_ORDER.indexOf(a.id)
    const bi = SECTION_ORDER.indexOf(b.id)
    if (ai === -1 && bi === -1) return 0
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

  return { meta, sections }
}

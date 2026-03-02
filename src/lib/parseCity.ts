import { marked } from 'marked'

marked.use({ async: false })

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

export interface SpotGroup {
  name: string      // empty string = ungrouped (Coffee, Drink, Do, Tips)
  introHtml: string // notes/context before first spot in the group
  spots: Spot[]
}

export interface CitySection {
  id: string
  label: string
  groups: SpotGroup[]
  introHtml: string // content before any group or spot
}

export interface ParsedCity {
  meta: CityMeta
  sections: CitySection[]
}

const SECTION_ORDER = ['eat', 'coffee', 'drink', 'do', 'tips']

function mdToHtml(src: string): string {
  return marked.parse(src) as string
}

// Browser-safe frontmatter parser (gray-matter uses Node's Buffer)
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

function parseSection(label: string, rawContent: string): CitySection {
  const id = label.toLowerCase().replace(/\s+/g, '-')

  // ── Grouped format: #### Group Name > ##### Spot Name (used for Eat) ──
  const groupRegex = /^#### (.+)$/gm
  const groupMatches = [...rawContent.matchAll(groupRegex)]

  let introHtml = ''
  const groups: SpotGroup[] = []

  if (groupMatches.length > 0) {
    if (groupMatches[0].index! > 0) {
      introHtml = mdToHtml(rawContent.slice(0, groupMatches[0].index!).trim())
    }

    groupMatches.forEach((gMatch, gi) => {
      const groupName = gMatch[1].trim()
      const groupStart = gMatch.index! + gMatch[0].length
      const groupEnd = groupMatches[gi + 1]?.index ?? rawContent.length
      const groupContent = rawContent.slice(groupStart, groupEnd).trim()

      const spotRegex = /^##### (.+)$/gm
      const spotMatches = [...groupContent.matchAll(spotRegex)]

      // Prose before the first ##### in this group (e.g. a note about the category)
      let groupIntroHtml = ''
      if (spotMatches.length > 0 && spotMatches[0].index! > 0) {
        groupIntroHtml = mdToHtml(groupContent.slice(0, spotMatches[0].index!).trim())
      } else if (spotMatches.length === 0) {
        groupIntroHtml = mdToHtml(groupContent)
      }

      const spots: Spot[] = spotMatches.map((sMatch, si) => {
        const name = sMatch[1].trim()
        const start = sMatch.index! + sMatch[0].length
        const end = spotMatches[si + 1]?.index ?? groupContent.length
        return { name, html: mdToHtml(groupContent.slice(start, end).trim()) }
      })

      groups.push({ name: groupName, introHtml: groupIntroHtml, spots })
    })

    return { id, label, groups, introHtml }
  }

  // ── Ungrouped format: ### Spot Name (Coffee, Drink, Do, Tips) ──
  const spotRegex = /^### (.+)$/gm
  const spotMatches = [...rawContent.matchAll(spotRegex)]

  if (spotMatches.length === 0) {
    // Pure prose — e.g. Tips bullet list
    introHtml = mdToHtml(rawContent.trim())
    return { id, label, groups: [], introHtml }
  }

  if (spotMatches[0].index! > 0) {
    introHtml = mdToHtml(rawContent.slice(0, spotMatches[0].index!).trim())
  }

  const spots: Spot[] = spotMatches.map((match, i) => {
    const name = match[1].trim()
    const start = match.index! + match[0].length
    const end = spotMatches[i + 1]?.index ?? rawContent.length
    return { name, html: mdToHtml(rawContent.slice(start, end).trim()) }
  })

  groups.push({ name: '', introHtml: '', spots })
  return { id, label, groups, introHtml }
}

export function parseCity(raw: string, slug: string): ParsedCity {
  const { data, content } = parseFrontmatter(raw)

  const meta: CityMeta = {
    title:      data.title      ?? slug,
    country:    data.country    ?? '',
    visited:    data.visited    ?? undefined,
    hero_image: data.hero_image ?? undefined,
    tagline:    data.tagline    ?? undefined,
    slug,
  }

  const sectionRegex = /^## (.+)$/gm
  const sectionMatches = [...content.matchAll(sectionRegex)]

  const sections: CitySection[] = sectionMatches.map((match, i) => {
    const label = match[1].trim()
    const start = match.index! + match[0].length
    const end = sectionMatches[i + 1]?.index ?? content.length
    return parseSection(label, content.slice(start, end).trim())
  })

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

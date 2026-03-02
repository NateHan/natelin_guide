import { parseCity, type CityMeta, type ParsedCity } from './parseCity'

// Load every .md file under content/ as a raw string at build time.
// Relative from this file (src/lib/) so Vite reliably discovers country/cities/*.md.
const rawFiles = import.meta.glob<string>('../../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace('.md', '')
}

function isTemplate(path: string): boolean {
  return path.includes('_template')
}

export function getCities(): CityMeta[] {
  return Object.entries(rawFiles)
    .filter(([path]) => !isTemplate(path))
    .map(([path, raw]) => parseCity(raw, slugFromPath(path)).meta)
    .sort((a, b) => a.title.localeCompare(b.title))
}

export function getCity(slug: string): ParsedCity | null {
  const entry = Object.entries(rawFiles).find(
    ([path]) => slugFromPath(path) === slug && !isTemplate(path),
  )
  if (!entry) return null
  const [path, raw] = entry
  return parseCity(raw, slugFromPath(path))
}

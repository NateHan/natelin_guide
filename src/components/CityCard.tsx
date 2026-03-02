import { Link } from 'react-router-dom'
import type { CityMeta } from '../lib/parseCity'

interface Props {
  city: CityMeta
}

const PLACEHOLDER_COLORS = [
  'bg-amber-400',
  'bg-rose-400',
  'bg-sky-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-orange-500',
]

function placeholderColor(slug: string): string {
  let hash = 0
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) & 0xffff
  return PLACEHOLDER_COLORS[hash % PLACEHOLDER_COLORS.length]
}

export default function CityCard({ city }: Props) {
  const { title, country, hero_image, tagline, slug } = city

  return (
    <Link
      to={`/${slug}`}
      className="block group overflow-hidden rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="relative aspect-[4/3]">
        {hero_image ? (
          <img
            src={hero_image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full ${placeholderColor(slug)}`} />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h2 className="font-display font-bold text-2xl leading-tight tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-white/70 mt-0.5 font-body">{country}</p>
          {tagline && (
            <p className="text-sm text-white/60 mt-2 font-body italic leading-snug line-clamp-2">
              &ldquo;{tagline}&rdquo;
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCities } from '../lib/getCities'

interface Props {
  cityName?: string
  citySlug?: string
}

export default function NavHeader({ cityName, citySlug }: Props) {
  const navigate = useNavigate()
  const cities = useMemo(() => getCities(), [])

  return (
    <header className="sticky top-0 z-50 bg-page/95 backdrop-blur-sm border-b border-stone-200">
      {/* Main nav row — always h-14 (56px) */}
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-display font-bold text-xl text-stone-900 hover:text-accent transition-colors"
        >
          natelin guide
        </Link>

        {cityName && (
          <span className="font-display font-semibold text-stone-400 text-sm tracking-wide">
            {cityName}
          </span>
        )}
      </div>

      {/* City picker row — only on city pages, always h-10 (40px) */}
      {citySlug && (
        <div className="h-10 max-w-5xl mx-auto px-6 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {cities.map((city) => (
            <button
              key={city.slug}
              onClick={() => navigate(`/${city.slug}`)}
              className={`text-xs font-display font-semibold px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                city.slug === citySlug
                  ? 'bg-accent text-white'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-800'
              }`}
            >
              {city.title}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}

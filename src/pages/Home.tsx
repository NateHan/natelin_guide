import { useMemo } from 'react'
import { getCities } from '../lib/getCities'
import CityCard from '../components/CityCard'
import NavHeader from '../components/NavHeader'

export default function Home() {
  const cities = useMemo(() => getCities(), [])

  return (
    <div className="min-h-screen bg-page">
      <NavHeader />

      <main className="max-w-5xl mx-auto px-6 pt-10 pb-16">
        <div className="mb-10">
          <p className="font-display font-semibold text-accent text-xs tracking-widest uppercase mb-2">
            a personal guide by nate
          </p>
          <h1 className="font-display font-bold text-5xl md:text-6xl text-stone-900 leading-none tracking-tight">
            natelin guide
          </h1>
          <p className="mt-3 text-stone-500 text-base max-w-sm font-body leading-relaxed">
            Where to eat, drink, and spend your time — from someone who's actually been.
          </p>
        </div>

        {cities.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🗺</p>
            <p className="text-stone-400 font-body text-sm">
              No cities yet — drop a Markdown file in{' '}
              <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-xs">
                content/
              </code>{' '}
              to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cities.map((city) => (
              <CityCard key={city.slug} city={city} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { getCity } from '../lib/getCities'
import SectionTabs from '../components/SectionTabs'
import SpotCard from '../components/SpotCard'

export default function CityGuide() {
  const { city: slug } = useParams<{ city: string }>()
  const parsed = useMemo(() => getCity(slug ?? ''), [slug])

  // Initial tab is the first section. State is reset via key={slug} in App.tsx.
  const [activeTab, setActiveTab] = useState(() => parsed?.sections[0]?.id ?? '')

  if (!parsed) return <Navigate to="/" replace />

  const { meta, sections } = parsed
  const currentSection = sections.find((s) => s.id === activeTab) ?? sections[0]

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {meta.hero_image ? (
          <img
            src={meta.hero_image}
            alt={meta.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-amber-400" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

        {/* Back button */}
        <Link
          to="/"
          className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-display font-semibold hover:bg-white/30 transition-colors"
        >
          ← All cities
        </Link>

        {/* City title */}
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="font-display font-bold text-4xl md:text-5xl leading-none tracking-tight">
            {meta.title}
          </h1>
          <p className="text-white/75 mt-1.5 font-body text-sm">
            {meta.country}
            {meta.visited ? ` · ${meta.visited}` : ''}
          </p>
          {meta.tagline && (
            <p className="text-white/60 mt-1 font-body text-sm italic">
              &ldquo;{meta.tagline}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Guide content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {sections.length > 0 ? (
          <>
            <SectionTabs
              sections={sections}
              activeId={currentSection?.id ?? ''}
              onChange={setActiveTab}
            />

            <div className="mt-8" role="tabpanel">
              {currentSection && (
                <>
                  {/* Intro prose (appears before any spot cards) */}
                  {currentSection.introHtml && (
                    <div
                      className="prose prose-stone max-w-none mb-6 text-sm"
                      dangerouslySetInnerHTML={{ __html: currentSection.introHtml }}
                    />
                  )}

                  {/* Spot cards grid */}
                  {currentSection.spots.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentSection.spots.map((spot) => (
                        <SpotCard key={spot.name} name={spot.name} html={spot.html} />
                      ))}
                    </div>
                  )}

                  {/* Empty state */}
                  {currentSection.spots.length === 0 && !currentSection.introHtml && (
                    <p className="text-stone-400 italic font-body text-sm">
                      Nothing here yet.
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <p className="text-stone-400 italic font-body text-sm">
            This guide is empty — add some Markdown sections to the city file.
          </p>
        )}
      </div>
    </div>
  )
}

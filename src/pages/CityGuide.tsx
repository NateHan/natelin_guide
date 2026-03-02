import { useState, useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { getCity } from '../lib/getCities'
import NavHeader from '../components/NavHeader'
import SectionTabs from '../components/SectionTabs'
import SpotCard from '../components/SpotCard'

export default function CityGuide() {
  const { city: slug } = useParams<{ city: string }>()
  const parsed = useMemo(() => getCity(slug ?? ''), [slug])
  const [activeTab, setActiveTab] = useState(() => parsed?.sections[0]?.id ?? '')

  if (!parsed) return <Navigate to="/" replace />

  const { meta, sections } = parsed
  const currentSection = sections.find((s) => s.id === activeTab) ?? sections[0]

  return (
    <div className="min-h-screen bg-page">
      {/* NavHeader: h-14 nav row + h-10 city picker = 96px total (top-24) */}
      <NavHeader cityName={meta.title} citySlug={slug} />

      {/* Hero image */}
      <div className="relative h-60 md:h-80 overflow-hidden">
        {meta.hero_image ? (
          <img
            src={meta.hero_image}
            alt={meta.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-amber-400" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="font-display font-bold text-4xl md:text-5xl leading-none tracking-tight">
            {meta.title}
          </h1>
          <p className="text-white/70 mt-1.5 text-sm font-body">
            {meta.country}{meta.visited ? ` · ${meta.visited}` : ''}
          </p>
          {meta.tagline && (
            <p className="text-white/55 mt-1.5 text-sm font-body italic">
              &ldquo;{meta.tagline}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Section tabs — sticky below NavHeader (top-24 = 96px) */}
      {sections.length > 0 && (
        <div className="sticky top-24 z-40 bg-page/95 backdrop-blur-sm border-b border-stone-200">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <SectionTabs
              sections={sections}
              activeId={currentSection?.id ?? ''}
              onChange={setActiveTab}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 pb-16">
        {currentSection ? (
          <>
            {/* Section-level intro prose */}
            {currentSection.introHtml && (
              <div
                className="prose prose-stone max-w-none mb-8 text-sm"
                dangerouslySetInnerHTML={{ __html: currentSection.introHtml }}
              />
            )}

            {currentSection.groups.length > 0 ? (
              <div className="space-y-10">
                {currentSection.groups.map((group) => (
                  <div key={group.name || '__ungrouped'}>
                    {/* Group label (only shown when Eat has named sub-groups) */}
                    {group.name && (
                      <h3 className="font-display font-bold text-xs uppercase tracking-widest text-accent mb-3">
                        {group.name}
                      </h3>
                    )}

                    {/* Group intro note */}
                    {group.introHtml && (
                      <div
                        className="group-intro mb-4"
                        dangerouslySetInnerHTML={{ __html: group.introHtml }}
                      />
                    )}

                    {/* Spot cards */}
                    {group.spots.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {group.spots.map((spot) => (
                          <SpotCard key={spot.name} name={spot.name} html={spot.html} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              !currentSection.introHtml && (
                <p className="text-stone-400 italic font-body text-sm">Nothing here yet.</p>
              )
            )}
          </>
        ) : (
          <p className="text-stone-400 italic font-body text-sm">
            This guide is empty — add Markdown sections to get started.
          </p>
        )}
      </div>
    </div>
  )
}

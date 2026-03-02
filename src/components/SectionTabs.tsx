import type { CitySection } from '../lib/parseCity'

interface Props {
  sections: CitySection[]
  activeId: string
  onChange: (id: string) => void
}

const SECTION_ICONS: Record<string, string> = {
  eat: '🍽',
  coffee: '☕',
  drink: '🍸',
  do: '🗺',
  tips: '💡',
}

export default function SectionTabs({ sections, activeId, onChange }: Props) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      role="tablist"
      aria-label="City guide sections"
    >
      {sections.map((section) => {
        const icon = SECTION_ICONS[section.id] ?? '•'
        const isActive = section.id === activeId

        return (
          <button
            key={section.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(section.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-display font-semibold text-sm whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
              isActive
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span aria-hidden="true">{icon}</span>
            <span>{section.label}</span>
          </button>
        )
      })}
    </div>
  )
}

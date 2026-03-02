interface Props {
  name: string
  html: string
}

export default function SpotCard({ name, html }: Props) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-100 flex flex-col gap-3">
      <h3 className="font-display font-bold text-base text-stone-900 leading-snug">
        {name}
      </h3>
      <div
        className="spot-content text-sm text-stone-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

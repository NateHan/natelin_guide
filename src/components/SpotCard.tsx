interface Props {
  name: string
  html: string
}

export default function SpotCard({ name, html }: Props) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-2.5">
      <h5 className="font-display font-bold text-[15px] text-stone-900 leading-snug">
        {name}
      </h5>
      <div
        className="spot-content text-sm text-stone-500 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

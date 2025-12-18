interface Props {
  title: string
  value: string
}

export default function AnalyticsCard({ title, value }: Props) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 flex flex-col">
      <span className="text-sm text-slate-500 dark:text-slate-300">{title}</span>
      <span className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-50">{value}</span>
    </div>
  )
}

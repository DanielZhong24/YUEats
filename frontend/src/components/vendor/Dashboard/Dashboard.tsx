import AnalyticsCard from './AnalyticsCard'
import Charts from './Charts'

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Dashboard</h1>
        <div className="text-sm text-slate-500">Overview of your restaurant performance</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <AnalyticsCard title="Orders" value="1,234" />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <AnalyticsCard title="Revenue" value="$12,345" />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <AnalyticsCard title="Active Items" value="48" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <Charts />
      </div>
    </div>
  )
}

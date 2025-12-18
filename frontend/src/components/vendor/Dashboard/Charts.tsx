interface ChartsProps {
  orders: any[]
}

export default function Charts({ orders }: ChartsProps) {
  return (
    <div className="w-full h-64 flex items-center justify-center text-slate-500">
      <div>Charts placeholder ({orders.length} orders)</div>
    </div>
  )
}

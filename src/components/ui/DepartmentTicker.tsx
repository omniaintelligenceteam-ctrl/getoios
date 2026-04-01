'use client'

const tickerItems = [
  'Phone Answering',
  'Job Scheduling',
  'Lead Follow-Up',
  'Review Requests',
  'Daily Briefings',
  'Invoice Reminders',
  'Sales Pipeline',
  'Content Creation',
  'Dispatch Routing',
  'Cash Flow Alerts',
]

export function DepartmentTicker() {
  const loopItems = [...tickerItems, ...tickerItems]

  return (
    <div className="w-full overflow-hidden bg-slate-900/40">
      <div
        className="flex w-max whitespace-nowrap py-3"
        style={{ animation: 'scroll 30s linear infinite' }}
      >
        {loopItems.map((item, index) => (
          <div key={`${item}-${index}`} className="inline-flex items-center shrink-0">
            <span className="mx-2 inline-flex items-center rounded-full border border-slate-700/50 bg-slate-800/50 px-3 py-1 text-slate-400 text-sm font-mono tracking-wide">
              {item}
            </span>
            <span className="text-teal-400 text-sm font-mono tracking-wide">·</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}

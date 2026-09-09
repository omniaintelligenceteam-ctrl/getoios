'use client'

/**
 * Only claims the product actually backs. The old strip promised routed crews,
 * weekly content and early cash-flow flags — none of which are live — so those
 * lines are gone rather than softened.
 */
const tickerItems = [
  'Briefed by 7 AM',
  'The schedule kept',
  'Past-due chases drafted',
  'Notes filed overnight',
  'Nothing spent without a yes',
  'Read back before it fires',
  'Your card by its last four',
  'Every request in the log',
  'Memory in files you own',
  'One sentence switches him off',
  'Backed up at 3:30',
  'Reversible in a step',
]

export function DepartmentTicker() {
  const loopItems = [...tickerItems, ...tickerItems]

  return (
    <div className="w-full overflow-hidden bg-slate-900/40">
      <div
        className="flex w-max whitespace-nowrap py-3"
        style={{ animation: 'scroll 42s linear infinite' }}
      >
        {loopItems.map((item, index) => (
          <div key={`${item}-${index}`} className="inline-flex shrink-0 items-center">
            <span className="mx-2 inline-flex items-center rounded-full border border-slate-700/50 bg-slate-800/50 px-3 py-1 font-mono text-sm tracking-wide text-slate-400">
              {item}
            </span>
            <span className="font-mono text-sm tracking-wide text-teal-400">·</span>
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
        @media (prefers-reduced-motion: reduce) {
          div {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}

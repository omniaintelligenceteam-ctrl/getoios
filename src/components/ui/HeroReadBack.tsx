import { JarvisOrb } from '@/components/ui/JarvisOrb'

/**
 * The hero frame: the moment Jarvis stops and reads an order back.
 *
 * This is the same beat the hero video holds at 12s, built in DOM instead of
 * pixels. It ships now, stays crisp at every width, needs no JS, and becomes
 * the video's poster shape when the render lands — at which point <Video>
 * takes this slot and this component becomes the reduced-motion fallback.
 *
 * Every figure here is invented. The "Example request" tag says so on screen,
 * and the card is shown by its last four the way the real read-back does it.
 */
const READ_BACK = [
  { label: 'Item', value: '40 boxes nitrile gloves, medium' },
  { label: 'Total', value: '$312.40' },
  { label: 'Ships to', value: 'The office, 1140 Main St' },
  { label: 'Card', value: 'Ending 4471' },
]

export function HeroReadBack() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-700/40 bg-[#080D18]">
      {/* Field glow behind the orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 70% at 24% 45%, rgba(111,165,210,0.10) 0%, transparent 65%)',
        }}
      />

      <div className="relative flex flex-col items-center gap-7 p-6 sm:p-8 md:flex-row md:items-center md:gap-10 md:p-10 lg:p-12">
        {/* Left: the orb */}
        <div className="flex flex-col items-center gap-4 md:items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-600/40 bg-slate-800/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
            Example request
          </span>
          <JarvisOrb size={200} locked priority className="md:!w-[240px] md:!h-[240px]" />
        </div>

        {/* Right: the request and the read-back */}
        <div className="w-full min-w-0 flex-1">
          <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
            <span className="text-slate-500">You:</span>{' '}
            &ldquo;Jarvis, reorder the gloves from the usual supplier. Same as last time.&rdquo;
          </p>

          <div className="mt-5 rounded-xl border border-teal-400/25 bg-slate-900/60 p-5 sm:p-6">
            <p
              className="text-base font-semibold text-white sm:text-lg"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              Before I place it:
            </p>

            <dl className="mt-4 space-y-2.5">
              {READ_BACK.map((row) => (
                <div key={row.label} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <dt className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    {row.label}
                  </dt>
                  <dd className="min-w-0 flex-1 text-sm text-slate-200 sm:text-base">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex items-center gap-3 border-t border-slate-700/50 pt-4">
              <span className="text-sm text-slate-400">Yes or no?</span>
              <span className="ml-auto inline-flex items-center gap-2 rounded-lg border border-teal-400/40 bg-teal-400/10 px-3.5 py-1.5 text-sm font-semibold text-teal-300">
                Yes
              </span>
              <span className="inline-flex items-center rounded-lg border border-slate-600/40 px-3.5 py-1.5 text-sm text-slate-400">
                No
              </span>
            </div>
          </div>

          <p className="mt-4 font-mono text-[11px] leading-relaxed text-slate-500">
            9:14 AM &middot; read-back approved &middot; logged
          </p>
        </div>
      </div>
    </div>
  )
}

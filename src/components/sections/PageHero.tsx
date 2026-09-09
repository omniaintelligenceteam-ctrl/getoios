import { Reveal } from '@/components/ui/Reveal'

interface PageHeroProps {
  title: string
  subtitle: string
  badge?: string
}

/**
 * Reveals through the `.reveal` CSS layer rather than motion's `initial`, which
 * wrote opacity:0 into the SSR output — so every inner page's own title was
 * invisible to anything that didn't run JS.
 */
export function PageHero({ title, subtitle, badge }: PageHeroProps) {
  return (
    <section className="relative bg-bg-primary overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-20">
      {/* Subtle radial gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(45,212,191,0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 100%, rgba(245,158,11,0.05) 0%, transparent 60%)',
        }}
      />

      {/* Faint grid overlay */}
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-30" />

      {/* Horizontal rule at top — decorative teal line */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {badge && (
          <Reveal className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-400/8 border border-teal-400/20 text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-teal-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-400" />
              </span>
              {badge}
            </span>
          </Reveal>
        )}

        <h1
          className="reveal reveal-d1 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight text-white mb-4"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
        >
          {title}
        </h1>

        <Reveal
          as="p"
          delay={2}
          className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto"
        >
          {subtitle}
        </Reveal>

        <Reveal delay={3} className="mt-10">
          <div
            className="mx-auto h-px max-w-xs"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(45,212,191,0.35), transparent)',
            }}
          />
        </Reveal>
      </div>
    </section>
  )
}

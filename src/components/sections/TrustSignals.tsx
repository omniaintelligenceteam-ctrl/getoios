import { Shield, Calendar, MapPin } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'

/**
 * The "works with" logo marquee is gone on purpose. It named a calendar we
 * don't sync with and an accounting tool we only read from, which read as a
 * bigger integration promise than the product makes.
 */
const trustCards = [
  {
    icon: Shield,
    title: 'You own everything',
    description:
      'Every tool, every integration, every note we build is yours. If you ever leave, it all walks with you.',
    pulse: true,
  },
  {
    icon: Calendar,
    title: 'Month-to-month',
    description:
      'No contracts. Cancel anytime. We earn the retainer every 30 days or you stop paying it.',
    pulse: false,
  },
  {
    icon: MapPin,
    title: 'Founded in Scottsdale, AZ',
    description:
      'Real people. Real company. A human partner who knows your business, not a ticket queue.',
    pulse: false,
  },
] as const

export function TrustSignals() {
  return (
    <section className="bg-bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-slate-700/40 bg-slate-800/40 px-3 py-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400">
                The partner model
              </span>
            </span>
          </Reveal>

          <h2
            className="reveal reveal-d1 mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            <span className="text-white">No contracts. No lock-in.</span>
            <br />
            <span className="gradient-text">You own everything.</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 lg:mt-16 lg:gap-6">
          {trustCards.map((card, i) => {
            const Icon = card.icon
            return (
              <Reveal
                key={card.title}
                delay={((i % 3) + 1) as 1 | 2 | 3}
                className="glass-card relative p-6 text-center lg:p-8"
              >
                <div className="relative mb-5 inline-flex items-center justify-center">
                  {card.pulse && (
                    <span
                      className="absolute inset-0 animate-ping rounded-full bg-teal-400/20"
                      style={{ animationDuration: '2.5s' }}
                    />
                  )}
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-teal-400/20 bg-teal-400/10">
                    <Icon className="h-6 w-6 text-teal-400" />
                  </div>
                </div>
                <h3
                  className="mb-2 text-lg font-bold text-white"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">{card.description}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

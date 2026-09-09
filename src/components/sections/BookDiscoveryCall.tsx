'use client'

import { CalBooking } from '@/components/ui/CalBooking'
import { Reveal } from '@/components/ui/Reveal'

export function BookDiscoveryCall() {
  return (
    <section className="relative overflow-hidden bg-bg-primary py-20 lg:py-28">
      {/* Subtle gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/[0.02] to-transparent" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <Reveal className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/5 px-4 py-1.5">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400" />
            <span className="text-sm font-medium tracking-wide text-teal-400">Book a call</span>
          </div>
        </Reveal>

        <h2
          className="reveal reveal-d1 mb-4 text-center text-3xl font-bold leading-tight md:text-4xl lg:text-5xl"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
        >
          Book the{' '}
          <span className="bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent">
            first call
          </span>
        </h2>

        <Reveal
          as="p"
          delay={2}
          className="mx-auto mb-12 max-w-2xl text-center text-lg text-slate-400"
        >
          Fifteen minutes, no pitch. We&rsquo;ll walk through your week, show you Jarvis running our
          business live, and pick the one thing that gets built first.
        </Reveal>

        <Reveal
          delay={3}
          className="overflow-hidden rounded-2xl border border-slate-800/60 bg-black/40 backdrop-blur-sm"
        >
          <CalBooking layout="inline" theme="dark" />
        </Reveal>
      </div>
    </section>
  )
}

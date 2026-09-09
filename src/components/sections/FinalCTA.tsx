import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { JarvisOrb } from '@/components/ui/JarvisOrb'
import { Reveal } from '@/components/ui/Reveal'

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-bg-primary py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 50% 40%, rgba(111,165,210,0.10) 0%, transparent 68%)',
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal as="p" className="font-mono text-xs uppercase tracking-[0.22em] text-teal-400">
          Briefed. Handled. Your call.
        </Reveal>

        <Reveal delay={1} className="mt-8 flex justify-center">
          <JarvisOrb size={180} />
        </Reveal>

        <h2
          className="reveal reveal-d2 mt-9 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
        >
          <span className="gradient-text-warm">Ready to hand him the day?</span>
        </h2>

        <Reveal as="p" delay={3} className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
          Month 1: install, plus your first build live by Day 7. Month-to-month. You own every tool,
          integration and note we build.
        </Reveal>

        <Reveal delay={4} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/form"
            data-glow
            data-cursor="cta"
            className="btn-glow inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-3.5 font-semibold text-white transition-all duration-200 hover:from-amber-600 hover:to-amber-500 sm:w-auto"
          >
            Start Month 1
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/#how-a-request-moves"
            data-cursor="cta"
            className="inline-flex w-full items-center justify-center rounded-xl border border-teal-500/30 px-8 py-3.5 font-medium text-teal-300 transition-all duration-200 hover:border-teal-400/50 hover:bg-teal-500/10 sm:w-auto"
          >
            Meet Jarvis
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

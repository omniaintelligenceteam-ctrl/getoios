import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HeroReadBack } from '@/components/ui/HeroReadBack'
import { Reveal } from '@/components/ui/Reveal'

/**
 * The hero holds one frame: Jarvis stopping to read an order back.
 *
 * No 3D scene, no cursor-following robot. The proof of the product is the
 * pause before the money moves, so that is what the top of the page shows.
 * When the HyperFrames render lands, <HeroReadBack /> is replaced by <Video>
 * with this composition as its poster.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg-primary pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% 0%, rgba(111,165,210,0.10) 0%, transparent 68%), radial-gradient(ellipse 45% 40% at 85% 90%, rgba(45,212,191,0.05) 0%, transparent 60%)',
        }}
      />
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal as="p" className="font-mono text-[11px] uppercase tracking-[0.16em] text-teal-400 sm:text-xs">
            We install AI Operating Systems for small businesses. Ours is named Jarvis.
          </Reveal>

          <Reveal
            as="h1"
            delay={1}
            className="mt-6 text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl"
          >
            <span className="gradient-text-hero">Jarvis handles the day.</span>
            <span className="mt-2 block text-white">Big decisions stay yours.</span>
          </Reveal>

          <Reveal
            as="p"
            delay={2}
            className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-slate-300/85 sm:text-lg"
          >
            A briefing by 7 AM. The schedule kept, the follow-ups written, the past-due invoices
            chased while you work. Anything that can&rsquo;t be undone, he reads back to you first.
          </Reveal>

          <Reveal delay={3} className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
              href="#how-a-request-moves"
              data-cursor="cta"
              className="inline-flex w-full items-center justify-center rounded-xl border border-teal-500/30 px-8 py-3.5 font-medium text-teal-300 transition-all duration-200 hover:border-teal-400/50 hover:bg-teal-500/10 sm:w-auto"
            >
              Meet Jarvis
            </Link>
          </Reveal>

          <Reveal delay={4} className="mt-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/40 px-4 py-1.5 text-xs text-slate-400 sm:text-sm">
              Month-to-month. You own everything we build.
            </span>
          </Reveal>
        </div>

        <Reveal delay={5} className="mx-auto mt-12 max-w-4xl lg:mt-16">
          <HeroReadBack />
          <p className="mt-4 text-center text-sm text-slate-500">
            That&rsquo;s how a request moves through Jarvis. Example order, real read-back.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

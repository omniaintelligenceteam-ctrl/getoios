'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

const includes = [
  'AI Receptionist — 24/7 call answering + lead capture',
  'AI Back Office — follow-ups, proposals, CRM updates',
  'AI Command Center — morning briefings, weekly reports, proactive alerts',
  'Direct access to Wes during onboarding',
  'Month-to-month — no contracts, cancel anytime',
  '60-day guarantee — if it doesn\'t pay for itself, you don\'t pay',
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/30 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            <span className="text-white">Simple.</span>{' '}
            <span className="gradient-text-warm">Founding Rate.</span>
          </h2>
          <p className="mt-5 text-slate-400 text-base max-w-xl mx-auto">
            We're in our first cohort. 10 spots only. Once they're gone, this price goes up.
          </p>
        </motion.div>

        {/* Single pricing card */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative glass-card p-8 lg:p-12 gradient-border-animated">
            {/* Founding badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-amber-500 to-amber-400 text-white px-6 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase shadow-lg shadow-amber-500/30 whitespace-nowrap">
                FOUNDING MEMBER RATE
              </div>
            </div>

            {/* Price */}
            <div className="text-center mb-8 pt-4">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-6xl font-bold gradient-text-warm" style={{ fontFamily: 'var(--font-display), sans-serif' }}>$2,000</span>
                <span className="text-slate-400 text-lg">/month</span>
              </div>
              <p className="text-slate-500 text-sm font-mono">+ $2,500 one-time setup</p>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-700/30 mb-8" />

            {/* Includes */}
            <div className="space-y-4 mb-8">
              {includes.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-400/15 border border-teal-400/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-teal-400 text-[10px] font-bold">✓</span>
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>

            {/* 60-day guarantee highlight */}
            <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4 mb-8 text-center">
              <div className="text-amber-400 text-sm font-semibold mb-1">60-Day Guarantee</div>
              <div className="text-slate-400 text-xs">If OIOS doesn't pay for itself in the first 60 days, you don't pay. Full stop.</div>
            </div>

            {/* CTA */}
            <Link
              href="#audit"
              className="block w-full py-4 rounded-xl font-bold text-center text-base bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-white btn-glow transition-all"
            >
              Claim Founding Rate →
            </Link>

            {/* Fine print */}
            <p className="text-center text-slate-600 text-xs font-mono mt-5">
              After founding cohort: $3,000/month · Only 10 founding spots available
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

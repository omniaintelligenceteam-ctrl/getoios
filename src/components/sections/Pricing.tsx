'use client'

import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { MagneticButton } from '@/components/ui/MagneticButton'

const includes = [
  'AI Receptionist — 24/7 call answering + lead capture',
  'AI Back Office — follow-ups, proposals, CRM updates',
  'AI Command Center — morning briefings, weekly reports, proactive alerts',
  'Direct access to Wes during onboarding',
  'Month-to-month — no contracts, cancel anytime',
  '60-day guarantee — if it doesn\'t pay for itself, you don\'t pay',
]

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const frame = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [active, target, duration])
  return count
}

// ─── Animated SVG Checkmark ──────────────────────────────────────────────────
function AnimatedCheckmark({ delay }: { delay: number }) {
  return (
    <div className="w-5 h-5 rounded-full bg-teal-400/15 border border-teal-400/25 flex items-center justify-center flex-shrink-0 mt-0.5">
      <svg viewBox="0 0 12 12" className="w-3 h-3">
        <motion.path
          d="M2.5 6.5l2 2 5-5"
          stroke="#2DD4BF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay }}
        />
      </svg>
    </div>
  )
}

export function Pricing() {
  const cardRef = useRef(null)
  const cardInView = useInView(cardRef, { once: true, margin: '-60px' })
  const priceCount = useCountUp(2000, 1.2, cardInView)

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
            <span className="text-white">Don&apos;t Pay Until</span>{' '}
            <span className="gradient-text-warm">It Pays for Itself.</span>
          </h2>
          <p className="mt-5 text-slate-400 text-base max-w-xl mx-auto">
            We prove the ROI first. If OIOS doesn&apos;t pay for itself in 60 days, you owe nothing. Founding cohort — 10 spots only.
          </p>
        </motion.div>

        {/* Pricing card with spotlight reveal */}
        <motion.div
          ref={cardRef}
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={cardInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.1, type: 'spring', stiffness: 100 }}
        >
          <div className="relative glass-card p-8 lg:p-12 gradient-border-animated">
            {/* Spotlight sweep effect */}
            {cardInView && (
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(245,158,11,0.08) 45%, rgba(245,158,11,0.12) 50%, rgba(45,212,191,0.08) 55%, transparent 60%)',
                }}
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
              />
            )}

            {/* Founding badge with shimmer */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <motion.div
                className="relative bg-gradient-to-r from-amber-500 to-amber-400 text-white px-6 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase shadow-lg shadow-amber-500/30 whitespace-nowrap overflow-hidden"
                initial={{ scale: 0, opacity: 0 }}
                animate={cardInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
              >
                FOUNDING MEMBER RATE
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              </motion.div>
            </div>

            {/* Price with countUp */}
            <div className="text-center mb-8 pt-4 relative z-10">
              <p className="text-slate-500 text-lg line-through mb-1">$3,000/mo</p>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-6xl font-bold gradient-text-warm" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                  ${priceCount.toLocaleString()}
                </span>
                <span className="text-slate-400 text-lg">/month</span>
              </div>
              <p className="text-slate-500 text-sm font-mono">+ $2,500 one-time setup</p>
            </div>

            {/* Zero-risk guarantee — THE headline of this card */}
            <motion.div
              className="bg-emerald-500/8 border-2 border-emerald-500/25 rounded-xl p-6 mb-8 text-center relative z-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={cardInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
            >
              <motion.span
                className="text-3xl block mb-2"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🛡️
              </motion.span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                You Don&apos;t Pay Until It Pays for Itself
              </h3>
              <p className="text-emerald-400 font-semibold text-sm mb-1">60-Day Performance Guarantee</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                If OIOS doesn&apos;t generate enough value to cover its cost in the first 60 days, you pay nothing. Not a discount — a full walk-away. We take the risk so you don&apos;t have to.
              </p>
            </motion.div>

            <div className="border-t border-slate-700/30 mb-8" />

            {/* Includes with staggered checkmarks */}
            <div className="space-y-4 mb-8 relative z-10">
              {includes.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={cardInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                >
                  <AnimatedCheckmark delay={0.8 + i * 0.12} />
                  <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Flexibility callout */}
            <motion.p
              className="text-center text-slate-300 font-medium text-sm mb-8 relative z-10"
              initial={{ opacity: 0 }}
              animate={cardInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.3 }}
            >
              Month-to-month. No contracts. Cancel anytime.
            </motion.p>

            {/* CTA */}
            <MagneticButton>
              <Link
                href="#audit"
                data-cursor="cta"
                className="block w-full py-4 rounded-xl font-bold text-center text-base bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white btn-glow transition-all duration-200 relative z-10"
              >
                Start Risk-Free →
              </Link>
            </MagneticButton>

            {/* Spots counter */}
            <motion.div
              className="flex items-center justify-center gap-2 mt-5 relative z-10"
              initial={{ opacity: 0 }}
              animate={cardInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.5 }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <span className="text-slate-400 text-xs font-mono">
                Only <span className="text-amber-400 font-bold">10</span> founding spots — price increases to $3,000/mo after
              </span>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

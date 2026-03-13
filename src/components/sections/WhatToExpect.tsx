'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'motion/react'
import { MagneticButton } from '@/components/ui/MagneticButton'
import {
  Phone,
  FileText,
  BarChart3,
  Shield,
  Zap,
  Clock,
  ChevronDown,
  Check,
} from 'lucide-react'

/* ─── Tier Data ──────────────────────────────────────────────────────────────── */

const tiers = [
  {
    name: 'Starter',
    tagline: 'Stop missing calls.',
    icon: Phone,
    accent: 'teal',
    description:
      'AI receptionist answers every call 24/7, captures leads, and books appointments — so you never lose another job to voicemail.',
    includes: [
      'AI call answering — 24/7, every ring',
      'Lead capture & instant text-back',
      'Appointment scheduling',
      'Daily summary briefings',
      'Direct access to Wes during setup',
    ],
    bestFor: 'Solo operators and 1–3 person crews',
  },
  {
    name: 'Growth',
    tagline: 'Run the back office on autopilot.',
    icon: FileText,
    accent: 'amber',
    popular: true,
    description:
      'Everything in Starter plus automated follow-ups, proposal generation, invoicing reminders, and CRM updates — your admin disappears.',
    includes: [
      'Everything in Starter',
      'Automated follow-ups & nurture sequences',
      'Proposal & estimate generation',
      'Invoice reminders & payment nudges',
      'CRM auto-updates & pipeline tracking',
      'Review request automation',
    ],
    bestFor: 'Growing teams doing $500K–$2M/year',
  },
  {
    name: 'Full Operations',
    tagline: 'Your entire business, orchestrated.',
    icon: BarChart3,
    accent: 'cyan',
    description:
      'Everything in Growth plus weekly reporting, proactive alerts, marketing content, compliance tracking, and multi-channel automation.',
    includes: [
      'Everything in Growth',
      'Weekly performance reports & insights',
      'Proactive business alerts',
      'Marketing content generation',
      'Compliance & documentation tracking',
      'Multi-channel automation (email, SMS, chat)',
      'Custom workflow builds',
    ],
    bestFor: 'Established businesses scaling past $2M/year',
  },
]

const accentClasses: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  teal: {
    border: 'border-teal-400/30 hover:border-teal-400/50',
    bg: 'bg-teal-400/10',
    text: 'text-teal-400',
    glow: 'shadow-teal-400/5',
  },
  amber: {
    border: 'border-amber-400/30 hover:border-amber-400/50',
    bg: 'bg-amber-400/10',
    text: 'text-amber-400',
    glow: 'shadow-amber-400/5',
  },
  cyan: {
    border: 'border-cyan-400/30 hover:border-cyan-400/50',
    bg: 'bg-cyan-400/10',
    text: 'text-cyan-400',
    glow: 'shadow-cyan-400/5',
  },
}

/* ─── Process Steps ──────────────────────────────────────────────────────────── */

const steps = [
  {
    num: '01',
    title: 'Free Audit',
    description:
      'We analyze your current workflow — calls missed, time wasted on admin, revenue left on the table. Takes 15 minutes.',
    icon: Zap,
  },
  {
    num: '02',
    title: 'Custom Build',
    description:
      'We configure your AI to match your business — your services, your tone, your process. You review everything before it goes live.',
    icon: Shield,
  },
  {
    num: '03',
    title: 'Go Live & Prove It',
    description:
      "Your AI goes live and we track every metric. If it doesn't pay for itself in 60 days, you owe nothing. Zero risk.",
    icon: Clock,
  },
]

/* ─── Animated Checkmark ─────────────────────────────────────────────────────── */

function AnimatedCheck({ delay, color }: { delay: number; color: string }) {
  return (
    <div
      className={`w-5 h-5 rounded-full ${color === 'amber' ? 'bg-amber-400/15 border-amber-400/25' : color === 'cyan' ? 'bg-cyan-400/15 border-cyan-400/25' : 'bg-teal-400/15 border-teal-400/25'} border flex items-center justify-center flex-shrink-0 mt-0.5`}
    >
      <svg viewBox="0 0 12 12" className="w-3 h-3">
        <motion.path
          d="M2.5 6.5l2 2 5-5"
          stroke={color === 'amber' ? '#FBBF24' : color === 'cyan' ? '#22D3EE' : '#2DD4BF'}
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

/* ─── Tier Card ──────────────────────────────────────────────────────────────── */

function TierCard({
  tier,
  index,
}: {
  tier: (typeof tiers)[0]
  index: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [expanded, setExpanded] = useState(false)
  const ac = accentClasses[tier.accent]
  const Icon = tier.icon

  return (
    <motion.div
      ref={ref}
      className={`relative glass-card border ${ac.border} transition-all duration-300 shadow-lg ${ac.glow} ${tier.popular ? 'lg:scale-105 lg:-my-2' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
    >
      {/* Popular badge */}
      {tier.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <motion.span
            className="relative bg-gradient-to-r from-amber-500 to-amber-400 text-white px-5 py-1 rounded-full text-xs font-bold tracking-[0.12em] uppercase shadow-lg shadow-amber-500/25 overflow-hidden"
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            MOST POPULAR
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            />
          </motion.span>
        </div>
      )}

      <div className="p-7 lg:p-9">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl ${ac.bg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${ac.text}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
              {tier.name}
            </h3>
            <p className={`text-sm font-medium ${ac.text}`}>{tier.tagline}</p>
          </div>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {tier.description}
        </p>

        {/* Custom pricing line */}
        <div className="flex items-baseline gap-2 mb-6">
          <span className={`text-2xl font-bold ${ac.text}`} style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            Custom
          </span>
          <span className="text-slate-500 text-sm">— based on your audit</span>
        </div>

        {/* Includes - collapsed on mobile */}
        <div className="mb-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3 md:pointer-events-none"
          >
            <Check className="w-4 h-4 text-slate-500" />
            <span>What&apos;s included</span>
            <motion.span
              className="md:hidden"
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </motion.span>
          </button>

          {/* Always visible on desktop, toggle on mobile */}
          <div className="hidden md:block">
            <div className="space-y-3">
              {tier.includes.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <AnimatedCheck delay={0.5 + i * 0.08} color={tier.accent} />
                  <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile accordion */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                className="md:hidden overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-3">
                  {tier.includes.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <AnimatedCheck delay={0.1 + i * 0.06} color={tier.accent} />
                      <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Best for */}
        <div className="text-xs font-mono text-slate-500 mb-6">
          Best for: <span className="text-slate-400">{tier.bestFor}</span>
        </div>

        {/* CTA */}
        <MagneticButton>
          <Link
            href="/audit"
            data-cursor="cta"
            className={`block w-full py-3.5 rounded-xl font-bold text-center text-sm transition-all duration-200 ${
              tier.popular
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white btn-glow'
                : 'bg-slate-800/60 border border-slate-700/40 text-white hover:border-slate-600/60 hover:bg-slate-800'
            }`}
          >
            {tier.popular ? 'Book Your Free Audit →' : 'Learn More →'}
          </Link>
        </MagneticButton>
      </div>
    </motion.div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */

export function WhatToExpect() {
  const guaranteeRef = useRef(null)
  const guaranteeInView = useInView(guaranteeRef, { once: true, margin: '-60px' })

  return (
    <>
      {/* Tiers Section */}
      <section className="py-24 lg:py-32 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/30 mb-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">
                Choose Your Level
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              <span className="text-white">Three Tiers.</span>{' '}
              <span className="gradient-text-warm">One Goal.</span>
            </h2>
            <p className="mt-5 text-slate-400 text-base max-w-xl mx-auto">
              Every business is different. Your audit determines which tier fits — and the price is based on what you actually need.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {tiers.map((tier, i) => (
              <TierCard key={tier.name} tier={tier} index={i} />
            ))}
          </div>

          {/* No-contract callout */}
          <motion.p
            className="text-center text-slate-500 text-sm font-mono mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Month-to-month · No contracts · Cancel anytime
          </motion.p>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 lg:py-32 bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/30 mb-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">
                The Process
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              <span className="text-white">From Audit to</span>{' '}
              <span className="gradient-text">Autopilot.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.num}
                  className="glass-card p-8 text-center"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/30 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-6 h-6 text-teal-400" />
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 tracking-[0.15em] mb-2">
                    STEP {step.num}
                  </div>
                  <h3
                    className="text-lg font-bold text-white mb-3"
                    style={{ fontFamily: 'var(--font-display), sans-serif' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 lg:py-28 bg-bg-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={guaranteeRef}
            className="glass-card p-8 lg:p-12 text-center relative overflow-hidden gradient-border-animated"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={guaranteeInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
          >
            {/* Spotlight sweep */}
            {guaranteeInView && (
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 40%, rgba(52,211,153,0.08) 45%, rgba(52,211,153,0.12) 50%, rgba(45,212,191,0.08) 55%, transparent 60%)',
                }}
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
              />
            )}

            <motion.span
              className="text-4xl block mb-4"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🛡️
            </motion.span>

            <h3
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              60-Day Performance Guarantee
            </h3>
            <p className="text-emerald-400 font-semibold text-base mb-3">
              You Don&apos;t Pay Until It Pays for Itself
            </p>
            <p className="text-slate-400 text-sm leading-relaxed max-w-lg mx-auto mb-8">
              If OIOS doesn&apos;t generate enough value to cover its cost in the first 60 days, you pay nothing. Not a discount — a full walk-away. We take the risk so you don&apos;t have to.
            </p>

            <MagneticButton>
              <Link
                href="/audit"
                data-cursor="cta"
                className="inline-block bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white px-8 py-3.5 rounded-xl text-sm font-bold btn-glow transition-all duration-200"
              >
                Start Risk-Free →
              </Link>
            </MagneticButton>
          </motion.div>
        </div>
      </section>
    </>
  )
}

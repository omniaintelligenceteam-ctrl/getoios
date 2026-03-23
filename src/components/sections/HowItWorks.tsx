'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { Link2, Bot, TrendingUp } from 'lucide-react'

const steps = [
  {
    number: '1',
    title: 'Connect',
    description: 'Link your phone, email, and calendar. OIOS plugs into your existing workflow — no rip-and-replace.',
    icon: Link2,
    color: 'text-teal-400',
    bgColor: 'bg-teal-400/10',
    borderColor: 'border-teal-400/20',
  },
  {
    number: '2',
    title: 'Automate',
    description: 'Your AI team handles calls, qualifies leads, sends follow-ups, tracks jobs, and reports KPIs — all automatically.',
    icon: Bot,
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/20',
  },
  {
    number: '3',
    title: 'Grow',
    description: 'More booked jobs, zero missed calls, real-time visibility. Your AI COO works 24/7 so you can focus on the work.',
    icon: TrendingUp,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/20',
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 bg-bg-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/15 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-teal-400/80">How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            <span className="text-white">Up and Running</span>{' '}
            <span className="gradient-text">in 24 Hours</span>
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto">
            No complicated setup. No training required. Connect your tools and let your AI team take over.
          </p>
        </motion.div>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                className={`glass-card p-6 sm:p-8 border ${step.borderColor} text-center`}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              >
                <div className={`w-14 h-14 rounded-2xl ${step.bgColor} border ${step.borderColor} flex items-center justify-center mx-auto mb-5`}>
                  <Icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <div className={`text-sm font-mono font-bold ${step.color} mb-2`}>
                  Step {step.number}
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

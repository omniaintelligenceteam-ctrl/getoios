'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'motion/react'

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

function StatCard({
  prefix,
  value,
  suffix,
  label,
  sublabel,
  accent,
  active,
  index,
}: {
  prefix?: string
  value: number
  suffix?: string
  label: string
  sublabel: string
  accent: string
  active: boolean
  index: number
}) {
  const count = useCountUp(value, 1.5, active)

  return (
    <motion.div
      className="glass-card p-6 lg:p-8 text-center"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={`text-4xl lg:text-5xl font-bold font-mono mb-2 ${accent}`}>
        {prefix}{count}{suffix}
      </div>
      <div className="text-sm font-semibold text-white mb-1">{label}</div>
      <div className="text-xs text-slate-500 font-mono">{sublabel}</div>
    </motion.div>
  )
}

const stats = [
  {
    prefix: '',
    value: 98,
    suffix: '%',
    label: 'Call Answer Rate',
    sublabel: 'vs 60–70% manual',
    accent: 'text-teal-400',
  },
  {
    prefix: '',
    value: 80,
    suffix: '%',
    label: 'Less Admin Time',
    sublabel: 'hours back every week',
    accent: 'text-amber-400',
  },
  {
    prefix: '$',
    value: 1500,
    suffix: '/mo',
    label: 'Starting Price',
    sublabel: 'vs $3,500/mo office admin',
    accent: 'text-cyan-400',
  },
  {
    prefix: '',
    value: 1,
    suffix: ' job',
    label: 'Pays the Bill',
    sublabel: 'one saved job per month covers it',
    accent: 'text-emerald-400',
  },
]

export function ROINumbers() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="roi" className="py-24 lg:py-32 bg-bg-primary">
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
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">The Numbers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            <span className="text-white">What It Actually</span>
            <br />
            <span className="gradient-text">Costs. What It Returns.</span>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} active={inView} index={i} />
          ))}
        </div>

        {/* ROI statement */}
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="glass-card p-8 lg:p-12">
            <p className="text-2xl lg:text-3xl font-bold leading-snug mb-3" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
              <span className="gradient-text-warm">One saved job per month</span>
              <span className="text-white"> covers your entire OIOS bill.</span>
            </p>
            <p className="text-slate-400 text-base">
              Everything else is pure margin.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

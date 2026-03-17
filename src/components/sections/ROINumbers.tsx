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

// ─── Circular Progress Ring ──────────────────────────────────────────────────
function CircularProgress({
  value,
  max,
  color,
  size = 80,
  active,
}: {
  value: number
  max: number
  color: string
  size?: number
  active: boolean
}) {
  const r = (size - 10) / 2
  const circumference = 2 * Math.PI * r
  const progress = value / max

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      <defs>
        <filter id={`ring-glow-${color.replace('#', '')}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor={color} floodOpacity="0.25" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#1E293B"
        strokeWidth="4"
      />
      {/* Progress ring */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        filter={`url(#ring-glow-${color.replace('#', '')})`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        initial={{ strokeDashoffset: circumference }}
        animate={active ? { strokeDashoffset: circumference * (1 - progress) } : { strokeDashoffset: circumference }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
      />
    </svg>
  )
}

// ─── Stat Card with ring ─────────────────────────────────────────────────────
function StatCard({
  prefix,
  value,
  suffix,
  label,
  sublabel,
  accent,
  hexColor,
  ringMax,
  active,
  index,
}: {
  prefix?: string
  value: number
  suffix?: string
  label: string
  sublabel: string
  accent: string
  hexColor: string
  ringMax: number
  active: boolean
  index: number
}) {
  const count = useCountUp(value, 1.5, active)

  return (
    <motion.div
      className="glass-card p-6 lg:p-8 text-center"
      data-glow
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
    >
      <CircularProgress
        value={value}
        max={ringMax}
        color={hexColor}
        size={90}
        active={active}
      />
      <div className={`text-3xl lg:text-4xl font-bold font-mono mt-3 mb-2 ${accent}`}>
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
    hexColor: '#2DD4BF',
    ringMax: 100,
  },
  {
    prefix: '',
    value: 80,
    suffix: '%',
    label: 'Less Admin Time',
    sublabel: 'hours back every week',
    accent: 'text-amber-400',
    hexColor: '#F59E0B',
    ringMax: 100,
  },
  {
    prefix: '',
    value: 24,
    suffix: '/7',
    label: 'Always On',
    sublabel: 'nights, weekends, holidays',
    accent: 'text-cyan-400',
    hexColor: '#06B6D4',
    ringMax: 24,
  },
  {
    prefix: '',
    value: 3,
    suffix: 'x',
    label: 'More Leads Captured',
    sublabel: 'vs missed calls after hours',
    accent: 'text-emerald-400',
    hexColor: '#34D399',
    ringMax: 5,
  },
]

// ─── Comparison Bar ──────────────────────────────────────────────────────────
function ComparisonBar({
  label,
  value,
  maxValue,
  color,
  active,
  delay,
}: {
  label: string
  value: string
  maxValue: number
  color: string
  active: boolean
  delay: number
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs text-slate-400 w-32 text-right font-mono">{label}</span>
      <div className="flex-1 h-6 bg-slate-800/60 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: '0%' }}
          animate={active ? { width: `${maxValue}%` } : { width: '0%' }}
          transition={{ duration: 1.2, delay, ease: 'easeOut' }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white font-bold">
          {value}
        </span>
      </div>
    </div>
  )
}

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

        {/* Stats grid with circular progress rings */}
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} active={inView} index={i} />
          ))}
        </div>


      </div>
    </section>
  )
}

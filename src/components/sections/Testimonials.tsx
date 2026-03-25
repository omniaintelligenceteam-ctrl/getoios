'use client'

import { motion, useInView } from 'motion/react'
import { useRef, useEffect, useState } from 'react'
import { Phone, Calendar, TrendingUp, Megaphone, Settings, DollarSign, Briefcase, Heart, Home, Shield, UtensilsCrossed } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ResultCard {
  icon: LucideIcon
  trade: string
  result: string
  metric: string
}

const row1: ResultCard[] = [
  { icon: Phone, trade: 'Insurance Agency', result: '40% more booked calls in first month', metric: '+40%' },
  { icon: Heart, trade: 'Dental Practice', result: 'Zero missed appointment requests', metric: '0 missed' },
  { icon: Home, trade: 'Real Estate Office', result: '3x faster lead response time', metric: '3x faster' },
  { icon: UtensilsCrossed, trade: 'Restaurant', result: 'Every reservation captured, 24/7', metric: '24/7' },
  { icon: Briefcase, trade: 'Consulting Firm', result: '15 hours/week saved on admin tasks', metric: '15hrs saved' },
]

const row2: ResultCard[] = [
  { icon: Shield, trade: 'Law Firm', result: 'Client intake handled automatically', metric: 'Auto' },
  { icon: Settings, trade: 'Plumbing Company', result: 'Morning briefings replace 2hrs of catch-up', metric: '2hrs/day' },
  { icon: DollarSign, trade: 'Accounting Firm', result: 'Invoice follow-ups sent automatically', metric: '$0 effort' },
  { icon: Megaphone, trade: 'Marketing Agency', result: 'Review requests after every project', metric: '3x reviews' },
  { icon: TrendingUp, trade: 'HVAC Company', result: 'Lead response time under 30 seconds', metric: '<30s' },
]

function Card({ item }: { item: ResultCard }) {
  const Icon = item.icon
  return (
    <div className="glass-card p-5 w-[320px] shrink-0 relative">
      {/* Metric badge */}
      <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-teal-400/15 border border-teal-400/25 text-teal-400 text-xs font-bold font-mono">
        {item.metric}
      </div>

      {/* Icon + trade */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-slate-800/60 border border-slate-700/30 flex items-center justify-center">
          <Icon className="w-4 h-4 text-teal-400" />
        </div>
        <span className="text-sm font-semibold text-white">{item.trade}</span>
      </div>

      {/* Result */}
      <p className="text-sm text-slate-400 leading-relaxed">{item.result}</p>
    </div>
  )
}

function MarqueeRow({
  items,
  speed,
  reverse = false,
  reducedMotion,
}: {
  items: ResultCard[]
  speed: number
  reverse?: boolean
  reducedMotion: boolean
}) {
  const [paused, setPaused] = useState(false)

  if (reducedMotion) {
    return (
      <div className="flex flex-wrap justify-center gap-4">
        {items.map((item, i) => (
          <Card key={i} item={item} />
        ))}
      </div>
    )
  }

  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="marquee-strip flex gap-4"
        style={{
          animation: `marquee-scroll ${speed}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
          animationPlayState: paused ? 'paused' : 'running',
          width: 'max-content',
        }}
      >
        {/* First set */}
        {items.map((item, i) => (
          <Card key={`a-${i}`} item={item} />
        ))}
        {/* Duplicate for seamless loop */}
        {items.map((item, i) => (
          <Card key={`b-${i}`} item={item} />
        ))}
      </div>
    </div>
  )
}

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <section className="py-24 lg:py-32 bg-bg-primary">
      <div ref={sectionRef}>
        {/* Header */}
        <div className="container mx-auto px-6 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400 text-xs font-semibold tracking-wider uppercase mb-6">
              Projected Results
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            What Small Business Owners{' '}
            <span className="gradient-text">Can Expect</span>
          </motion.h2>

          <motion.p
            className="text-slate-400 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Based on industry benchmarks and AI automation data across small businesses.
          </motion.p>
        </div>

        {/* Marquee rows */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <MarqueeRow items={row1} speed={35} reducedMotion={reducedMotion} />
          <MarqueeRow items={row2} speed={40} reverse reducedMotion={reducedMotion} />
        </motion.div>
      </div>
    </section>
  )
}

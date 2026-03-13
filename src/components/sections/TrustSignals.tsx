'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { Shield, Calendar, MapPin } from 'lucide-react'
import { LogoMarquee } from '@/components/ui/LogoMarquee'

// ─── Count-up hook ───────────────────────────────────────────────────────────
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

// ─── Powered-by tech badges ─────────────────────────────────────────────────
const techStack = ['Retell AI', 'Twilio', 'OpenAI', 'Vercel', 'ServiceTitan', 'Housecall Pro', 'Jobber', 'QuickBooks']

// ─── Trust cards data ────────────────────────────────────────────────────────
const trustCards = [
  {
    icon: Shield,
    title: 'Pay Nothing Until It Works',
    description: "60-day performance guarantee. If OIOS doesn't pay for itself, you walk away free.",
    pulse: true,
  },
  {
    icon: Calendar,
    title: 'Month-to-Month',
    description: 'No contracts. Cancel anytime. No fees.',
    pulse: false,
  },
  {
    icon: MapPin,
    title: 'Founded in Scottsdale, AZ',
    description: 'Real people. Real company. Local touch.',
    pulse: false,
  },
]

// ─── Trust Card component ────────────────────────────────────────────────────
function TrustCard({
  icon: Icon,
  title,
  description,
  pulse,
  index,
}: {
  icon: typeof Shield
  title: string
  description: string
  pulse: boolean
  index: number
}) {
  return (
    <motion.div
      className="glass-card p-6 lg:p-8 text-center relative"
      data-glow
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
    >
      <div className="relative inline-flex items-center justify-center mb-5">
        {/* Pulsing ring for shield icon */}
        {pulse && (
          <span className="absolute inset-0 rounded-full animate-ping bg-teal-400/20" style={{ animationDuration: '2.5s' }} />
        )}
        <div className="w-14 h-14 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center relative">
          <Icon className="w-6 h-6 text-teal-400" />
        </div>
      </div>
      <h3
        className="text-lg font-bold text-white mb-2"
        style={{ fontFamily: 'var(--font-display), sans-serif' }}
      >
        {title}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function TrustSignals() {
  const statRef = useRef(null)
  const statInView = useInView(statRef, { once: true, margin: '-80px' })
  const count = useCountUp(1200, 1.8, statInView)

  return (
    <section className="py-24 lg:py-32 bg-bg-secondary">
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
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">Why Trust Us</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            <span className="text-white">Zero Risk.</span>
            <br />
            <span className="gradient-text">We Prove It First.</span>
          </h2>
        </motion.div>

        {/* Powered-by row */}
        <div className="mb-16">
          <p className="text-center text-[10px] font-mono uppercase tracking-[0.15em] text-slate-500 mb-4">Powered by</p>
          <LogoMarquee items={techStack} speed={25} />
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-16">
          {trustCards.map((card, i) => (
            <TrustCard key={card.title} {...card} index={i} />
          ))}
        </div>

        {/* Stat counter */}
        <motion.div
          ref={statRef}
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass-card p-8 lg:p-12 relative overflow-hidden">
            <div
              className="absolute inset-0 rounded-xl opacity-30"
              style={{
                background:
                  'linear-gradient(135deg, rgba(45,212,191,0.15) 0%, transparent 50%, rgba(245,158,11,0.15) 100%)',
              }}
            />
            <div
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono text-teal-400 mb-3 relative"
            >
              {count.toLocaleString()}+
            </div>
            <p
              className="text-lg lg:text-xl font-semibold text-white mb-1 relative"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              Demo Calls Completed
            </p>
            <p className="text-sm text-slate-500 font-mono relative">and counting</p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

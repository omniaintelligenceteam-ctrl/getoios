'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

interface PageHeroProps {
  title: string
  subtitle: string
  badge?: string
}

export function PageHero({ title, subtitle, badge }: PageHeroProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="relative bg-bg-primary overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-20">
      {/* Subtle radial gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(45,212,191,0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 100%, rgba(245,158,11,0.05) 0%, transparent 60%)',
        }}
      />

      {/* Faint grid overlay */}
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-30" />

      {/* Horizontal rule at top — decorative teal line */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

      <div ref={ref} className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        {badge && (
          <motion.div
            className="flex justify-center mb-5"
            initial={{ opacity: 0, y: -8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-400/8 border border-teal-400/20 text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-teal-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-400" />
              </span>
              {badge}
            </span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight text-white mb-4"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          {subtitle}
        </motion.p>

        {/* Bottom decorative line */}
        <motion.div
          className="mt-10 mx-auto h-px max-w-xs"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(45,212,191,0.35), transparent)',
          }}
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        />
      </div>
    </section>
  )
}

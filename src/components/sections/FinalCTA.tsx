'use client'

import Link from 'next/link'
import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { MagneticButton } from '@/components/ui/MagneticButton'

const stars = [
  { top: '10%', right: '10%', duration: '4s', delay: '0s', color: 'rgba(45,212,191,0.5)' },
  { top: '20%', right: '30%', duration: '6s', delay: '1s', color: 'rgba(45,212,191,0.3)' },
  { top: '5%', right: '50%', duration: '5s', delay: '2s', color: 'rgba(245,158,11,0.4)' },
  { top: '35%', right: '15%', duration: '7s', delay: '0.5s', color: 'rgba(45,212,191,0.4)' },
  { top: '15%', right: '70%', duration: '4.5s', delay: '3s', color: 'rgba(245,158,11,0.3)' },
  { top: '40%', right: '45%', duration: '8s', delay: '1.5s', color: 'rgba(45,212,191,0.35)' },
]

export function FinalCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 lg:py-32 bg-bg-primary relative overflow-hidden">
      {/* Shooting stars */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute w-20 h-px shooting-star"
          style={{
            top: star.top,
            right: star.right,
            background: `linear-gradient(90deg, transparent, ${star.color}, transparent)`,
            animationDuration: star.duration,
            animationDelay: star.delay,
          }}
        />
      ))}

      <div ref={ref} className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 mb-8"
        >
          <span className="text-amber-400 text-sm font-medium tracking-wide">Last Call</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
        >
          Ready to Stop Chasing
          <br />
          <span className="gradient-text-warm">and Start Running?</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
        >
          Join the founding cohort. Your AI operations team is ready.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <MagneticButton>
            <Link
              href="#audit"
              data-glow
              data-cursor="cta"
              className="bg-gradient-to-r from-amber-500 to-amber-400 text-white px-10 py-4 rounded-lg font-semibold text-lg btn-glow hover:from-amber-600 hover:to-amber-500 transition-all duration-200"
            >
              Start Risk-Free &rarr;
            </Link>
          </MagneticButton>
        </motion.div>

        {/* Scarcity note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 text-sm text-muted-foreground flex items-center justify-center gap-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          Only 10 founding spots — price increases to $3,000/mo after
        </motion.p>
      </div>
    </section>
  )
}

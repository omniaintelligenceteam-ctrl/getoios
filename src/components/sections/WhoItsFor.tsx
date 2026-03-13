'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Flame,
  Wrench,
  Zap,
  Key,
  Bug,
  Trees,
} from 'lucide-react';

const trades = [
  { icon: Flame, name: 'HVAC', hook: 'Never lose a service call to voicemail again' },
  { icon: Wrench, name: 'Plumbing', hook: 'Emergency calls answered instantly, 24/7' },
  { icon: Zap, name: 'Electrical', hook: 'Book more jobs while you\'re on the job' },
  { icon: Key, name: 'Locksmith', hook: 'Capture every lockout call, day or night' },
  { icon: Bug, name: 'Pest Control', hook: 'Fill your schedule without lifting a finger' },
  { icon: Trees, name: 'Landscaping', hook: 'Turn seasonal inquiries into year-round revenue' },
];

function SpotlightCard({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card relative overflow-hidden ${className || ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-glow
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Spotlight overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(45,212,191,0.08), transparent 40%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

export function WhoItsFor() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-bg-primary relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/30 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">
              Who This Is For
            </span>
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-6"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          If Your Phone Goes to Voicemail,{' '}
          <span className="gradient-text">This Is For You.</span>
        </motion.h2>

        {/* Bento Trade Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 mt-16">
          {trades.map((trade, i) => (
            <SpotlightCard
              key={trade.name}
              className="p-6 lg:p-8"
              delay={i * 0.1}
            >
              <div className="text-center">
                <div className="mx-auto mb-4 w-14 h-14 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
                  <trade.icon className="w-7 h-7 text-teal-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display), sans-serif' }}>{trade.name}</h3>
                <p className="text-sm text-slate-400">{trade.hook}</p>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* Bold Statement */}
        <motion.p
          className="text-center mt-16 text-lg sm:text-xl text-slate-300 font-semibold max-w-2xl mx-auto"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          5-50 person service companies losing leads to voicemail.{' '}
          <span className="text-white">
            That&apos;s who we built this for.
          </span>
        </motion.p>
      </div>
    </section>
  );
}

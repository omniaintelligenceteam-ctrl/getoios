'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

const timelineSteps = [
  {
    time: '7:15 AM',
    text: 'Phone rings while you\'re on a job. Goes to voicemail. Lead\'s gone by noon.',
    icon: '📞',
  },
  {
    time: '9:30 AM',
    text: 'You just remembered to follow up on that proposal from last week. Too late.',
    icon: '📄',
  },
  {
    time: '11:00 AM',
    text: 'Another customer wants an ETA. You\'re elbow-deep in work. No one answers.',
    icon: '🔧',
  },
  {
    time: '2:00 PM',
    text: 'Your helper forgot to update the CRM. Now you don\'t know where three jobs stand.',
    icon: '🗄️',
  },
  {
    time: '4:45 PM',
    text: 'End of day. You\'re exhausted. Tomorrow looks exactly the same.',
    icon: '😓',
  },
]

// ─── Full-Width Animated Chaos Scene ────────────────────────────────────────
function ChaosScene() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div className="relative w-full max-w-3xl mx-auto mb-16" style={{ aspectRatio: '800/300' }}>
      <svg
        ref={ref}
        viewBox="0 0 800 300"
        fill="none"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="chaos-glow-red" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor="#EF4444" floodOpacity="0.3" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="chaos-glow-amber" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feFlood floodColor="#F59E0B" floodOpacity="0.25" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Chaotic dotted connection line */}
        <motion.path
          d="M 80 150 Q 180 60 280 140 Q 380 220 480 120 Q 560 60 680 160"
          stroke="rgba(239,68,68,0.3)"
          strokeWidth="2"
          strokeDasharray="6 6"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: 'easeOut' }}
        />

        {/* === Phone — ringing with missed call ripples === */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 300 }}
          style={{ transformOrigin: '100px 130px' }}
        >
          {/* Phone body */}
          <rect x="78" y="108" width="44" height="44" rx="10" fill="#0F172A" stroke="#EF4444" strokeWidth="1.2" filter="url(#chaos-glow-red)" />
          <text x="100" y="137" textAnchor="middle" fontSize="20">📞</text>
          {/* Missed call ripples */}
          {inView && [0, 1, 2].map((i) => (
            <circle key={`ripple-${i}`} cx="100" cy="130" r="22" fill="none" stroke="#EF4444" strokeWidth="1" opacity="0">
              <animate attributeName="r" values="22;55" dur="2s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0" dur="2s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
            </circle>
          ))}
          <text x="100" y="175" textAnchor="middle" fill="#EF4444" fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="0.1em" opacity="0.7">MISSED</text>
        </motion.g>

        {/* === Inbox overflowing with stacking papers === */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6, type: 'spring', stiffness: 300 }}
          style={{ transformOrigin: '280px 130px' }}
        >
          <rect x="258" y="108" width="44" height="44" rx="10" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.2" filter="url(#chaos-glow-amber)" />
          {/* Stacking paper animation */}
          {inView && [0, 1, 2, 3].map((i) => (
            <rect key={`paper-${i}`} x={268 + i} y={120 - i * 4} width="20" height="3" rx="1" fill="#F59E0B" opacity="0">
              <animate attributeName="opacity" values="0;0.5;0.5;0.3" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
              <animate attributeName="y" values={`${130};${118 - i * 4}`} dur="0.5s" begin={`${i * 0.5}s`} repeatCount="indefinite" fill="freeze" />
            </rect>
          ))}
          <text x="280" y="137" textAnchor="middle" fontSize="20">📄</text>
          <text x="280" y="175" textAnchor="middle" fill="#F59E0B" fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="0.1em" opacity="0.7">BACKLOG</text>
        </motion.g>

        {/* === Clock spinning fast === */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.9, type: 'spring', stiffness: 300 }}
          style={{ transformOrigin: '460px 130px' }}
        >
          <circle cx="460" cy="130" r="24" fill="#0F172A" stroke="#EF4444" strokeWidth="1.2" filter="url(#chaos-glow-red)" />
          <text x="460" y="137" textAnchor="middle" fontSize="20">⏰</text>
          {/* Spinning time indicator */}
          {inView && (
            <g>
              <line x1="460" y1="130" x2="460" y2="112" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" opacity="0.5">
                <animateTransform attributeName="transform" type="rotate" from="0 460 130" to="360 460 130" dur="2s" repeatCount="indefinite" />
              </line>
            </g>
          )}
          <text x="460" y="175" textAnchor="middle" fill="#EF4444" fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="0.1em" opacity="0.7">NO TIME</text>
        </motion.g>

        {/* === Calendar with X marks === */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.2, type: 'spring', stiffness: 300 }}
          style={{ transformOrigin: '640px 130px' }}
        >
          <rect x="618" y="108" width="44" height="44" rx="10" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.2" filter="url(#chaos-glow-amber)" />
          <text x="640" y="137" textAnchor="middle" fontSize="20">📅</text>
          {/* X marks appearing */}
          {inView && [0, 1, 2].map((i) => (
            <text key={`x-${i}`} x={630 + i * 12} y="120" textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold" opacity="0">
              ✕
              <animate attributeName="opacity" values="0;0.7" dur="0.3s" begin={`${1.5 + i * 0.4}s`} fill="freeze" />
            </text>
          ))}
          <text x="640" y="175" textAnchor="middle" fill="#F59E0B" fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="0.1em" opacity="0.7">OVERBOOKED</text>
        </motion.g>

        {/* === Money floating away === */}
        {inView && [0, 1, 2].map((i) => (
          <text key={`dollar-${i}`} x={200 + i * 200} y="60" textAnchor="middle" fontSize="14" opacity="0">
            💸
            <animate attributeName="y" values="80;30" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
          </text>
        ))}

        {/* Horizontal chaos pulse line */}
        {inView && (
          <line x1="60" y1="240" x2="740" y2="240" stroke="#EF4444" strokeWidth="0.5" opacity="0.15">
            <animate attributeName="opacity" values="0.15;0.3;0.15" dur="2s" repeatCount="indefinite" />
          </line>
        )}
      </svg>
    </div>
  )
}

// ─── Timeline Card with scroll reveal ────────────────────────────────────────
function TimelineCard({ step, index, total }: { step: typeof timelineSteps[0]; index: number; total: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })

  return (
    <motion.div
      ref={ref}
      className="flex gap-6"
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Timeline dot + connector */}
      <div className="flex flex-col items-center">
        <motion.div
          className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center flex-shrink-0"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
        >
          <span className="text-[9px] font-bold text-red-400/80 text-center leading-tight px-1">{step.time}</span>
        </motion.div>
        {index < total - 1 && (
          <motion.div
            className="w-px h-full min-h-[36px] bg-gradient-to-b from-red-500/20 to-transparent my-1"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ transformOrigin: 'top' }}
          />
        )}
      </div>

      {/* Content card */}
      <motion.div
        className="glass-card p-5 mb-4 flex-1 border-red-500/10"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-start gap-3">
          <span className="text-lg flex-shrink-0">{step.icon}</span>
          <p className="text-slate-300 text-sm leading-relaxed">{step.text}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function PainPoints() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section id="pain-points" className="py-24 lg:py-32 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={headerRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/15 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-red-400/80">The Problem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            <span className="text-white">Your Day</span>{' '}
            <span className="gradient-text-warm">Right Now</span>
          </h2>
          <p className="text-slate-500 text-base max-w-md mx-auto">
            If you run a service business, this is probably too familiar.
          </p>
        </motion.div>

        {/* Full-width chaos scene */}
        <ChaosScene />

        {/* Timeline */}
        <div className="max-w-2xl mx-auto">
          <div className="space-y-0">
            {timelineSteps.map((step, index) => (
              <TimelineCard key={index} step={step} index={index} total={timelineSteps.length} />
            ))}
          </div>
        </div>

        {/* Closing line */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Sound familiar?{' '}
            <span className="gradient-text-warm font-semibold">It doesn&apos;t have to be.</span>
          </p>
        </motion.div>

      </div>
    </section>
  )
}

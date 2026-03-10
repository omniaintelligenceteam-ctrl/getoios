'use client'

import Link from 'next/link'
import { useRef, useEffect } from 'react'
import { motion, useInView } from 'motion/react'
import { BarChart2, Zap, RefreshCw, Phone } from 'lucide-react'
import { FloatingPaths } from '@/components/ui/background-paths'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { useScrollVelocity } from '@/hooks/useScrollVelocity'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'

// ─── Animated Energy Network SVG ────────────────────────────────────────────
function EnergyNetwork() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true })

  const nodes = [
    { id: 'monitor', x: 160, y: 100, icon: '📊', color: '#2DD4BF', label: 'MONITOR' },
    { id: 'build', x: 440, y: 60, icon: '⚡', color: '#F59E0B', label: 'BUILD' },
    { id: 'automate', x: 440, y: 240, icon: '🔄', color: '#06B6D4', label: 'AUTOMATE' },
    { id: 'run', x: 160, y: 200, icon: '📞', color: '#34D399', label: 'RUN' },
  ]

  const connections = [
    { from: 0, to: 1, d: 'M 190 110 Q 300 50 410 75' },
    { from: 1, to: 2, d: 'M 455 90 Q 480 160 455 220' },
    { from: 2, to: 3, d: 'M 410 245 Q 300 270 190 215' },
    { from: 3, to: 0, d: 'M 150 185 Q 120 150 150 115' },
    { from: 0, to: 2, d: 'M 190 125 Q 300 170 410 230' },
    { from: 1, to: 3, d: 'M 415 80 Q 300 150 185 195' },
  ]

  return (
    <div className="relative w-full max-w-[600px] mx-auto" style={{ aspectRatio: '600/300' }}>
      <svg
        ref={ref}
        viewBox="0 0 600 300"
        fill="none"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Glow filters */}
        <defs>
          {nodes.map((node) => (
            <filter key={`glow-${node.id}`} id={`glow-${node.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feFlood floodColor={node.color} floodOpacity="0.4" result="color" />
              <feComposite in="color" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
          <filter id="glow-core" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feFlood floodColor="#2DD4BF" floodOpacity="0.3" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Gradient defs for connections */}
          {connections.map((conn, i) => (
            <linearGradient key={`grad-${i}`} id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={nodes[conn.from].color} />
              <stop offset="100%" stopColor={nodes[conn.to].color} />
            </linearGradient>
          ))}
        </defs>

        {/* Connection lines */}
        {connections.map((conn, i) => (
          <motion.path
            key={`conn-${i}`}
            d={conn.d}
            stroke={`url(#grad-${i})`}
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.35 } : {}}
            transition={{ duration: 1.5, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
          />
        ))}

        {/* Energy pulses traveling along paths */}
        {inView && connections.slice(0, 4).map((conn, i) => (
          <circle key={`pulse-${i}`} r="3" fill={nodes[conn.from].color} opacity="0" filter={`url(#glow-${nodes[conn.from].id})`}>
            <animateMotion dur={`${3 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.7}s`} path={conn.d} />
            <animate attributeName="opacity" values="0;0.8;0.8;0" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.7}s`} />
          </circle>
        ))}

        {/* Center core */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{ transformOrigin: '300px 150px' }}
        >
          <circle cx="300" cy="150" r="28" fill="#0F172A" stroke="#2DD4BF" strokeWidth="1.5" filter="url(#glow-core)" />
          <circle cx="300" cy="150" r="20" fill="rgba(45,212,191,0.1)" />
          <text x="300" y="155" textAnchor="middle" fill="#2DD4BF" fontSize="12" fontWeight="bold" fontFamily="monospace">OIOS</text>
        </motion.g>

        {/* Core pulse ring */}
        {inView && (
          <circle cx="300" cy="150" r="28" fill="none" stroke="#2DD4BF" strokeWidth="1" opacity="0">
            <animate attributeName="r" values="28;50" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0" dur="2s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Capability nodes */}
        {nodes.map((node, i) => (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 + i * 0.15, type: 'spring', stiffness: 300 }}
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
          >
            <circle cx={node.x} cy={node.y} r="24" fill="#0F172A" stroke={node.color} strokeWidth="1" opacity="0.8" />
            <circle cx={node.x} cy={node.y} r="18" fill={`${node.color}10`} />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="14">{node.icon}</text>
            <text
              x={node.x}
              y={node.y + 42}
              textAnchor="middle"
              fill={node.color}
              fontSize="8"
              fontWeight="bold"
              fontFamily="monospace"
              letterSpacing="0.15em"
              opacity="0.8"
            >
              {node.label}
            </text>
          </motion.g>
        ))}

        {/* Node pulse rings */}
        {inView && nodes.map((node, i) => (
          <circle key={`npulse-${i}`} cx={node.x} cy={node.y} r="24" fill="none" stroke={node.color} strokeWidth="0.5" opacity="0">
            <animate attributeName="r" values="24;40" dur="2.5s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0" dur="2.5s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  )
}

// ─── Animated Stat ───────────────────────────────────────────────────────────
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="text-center">
      <motion.div
        className="text-xl sm:text-2xl font-bold gradient-text-warm"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {value}
      </motion.div>
      <div className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider mt-1">{label}</div>
    </div>
  )
}

// ─── Capability Data ─────────────────────────────────────────────────────────
const capabilities = [
  {
    label: 'MONITOR',
    icon: BarChart2,
    color: 'text-teal-400',
    border: 'border-teal-400/20',
    glow: 'group-hover:text-teal-300',
    bg: 'group-hover:bg-teal-400/5',
    items: ['Pipeline at a glance', 'Revenue tracking', 'AI morning briefing', 'Weekly report'],
  },
  {
    label: 'BUILD',
    icon: Zap,
    color: 'text-amber-400',
    border: 'border-amber-400/20',
    glow: 'group-hover:text-amber-300',
    bg: 'group-hover:bg-amber-400/5',
    items: ['Proposals in 30 sec', 'Client onboarding', 'Email drafts ready', 'Workflows on day 1'],
  },
  {
    label: 'AUTOMATE',
    icon: RefreshCw,
    color: 'text-cyan-400',
    border: 'border-cyan-400/20',
    glow: 'group-hover:text-cyan-300',
    bg: 'group-hover:bg-cyan-400/5',
    items: ['Follow-ups sent', 'CRM kept current', 'Stale deal alerts', 'Review requests'],
  },
  {
    label: 'RUN',
    icon: Phone,
    color: 'text-emerald-400',
    border: 'border-emerald-400/20',
    glow: 'group-hover:text-emerald-300',
    bg: 'group-hover:bg-emerald-400/5',
    items: ['24/7 call answering', 'Lead scoring', 'Appt booking', 'Call transcripts'],
  },
]

const stats = [
  { value: '98%', label: 'Call Answer Rate' },
  { value: '24/7/365', label: 'Coverage' },
  { value: '30 sec', label: 'Proposals' },
  { value: '0', label: 'Missed Follow-Ups' },
]

// ─── Main Hero Export ────────────────────────────────────────────────────────
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  useScrollVelocity()

  // Parallax on background elements
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const section = sectionRef.current
    if (!section) return

    const orbs = section.querySelectorAll('.orb')
    const grid = section.querySelector('.hero-grid')
    const paths = section.querySelectorAll('.floating-paths')

    const ctx = gsap.context(() => {
      // Each orb moves at different parallax speed
      orbs.forEach((orb, i) => {
        const speed = [0.3, 0.5, 0.2][i] || 0.3
        gsap.to(orb, {
          y: () => window.innerHeight * speed * -0.5,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      })

      // Grid gets subtle parallax
      if (grid) {
        gsap.to(grid, {
          y: () => window.innerHeight * 0.15,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // Floating paths get very subtle parallax
      paths.forEach((path) => {
        gsap.to(path, {
          y: () => window.innerHeight * 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-bg-primary overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="hero-grid absolute inset-0" style={{ willChange: 'transform' }} />
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
        <div className="orb orb-1" style={{ willChange: 'transform' }} />
        <div className="orb orb-2" style={{ willChange: 'transform' }} />
        <div className="orb orb-3" style={{ willChange: 'transform' }} />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32 pb-16">

        {/* Badge */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/30 border border-slate-700/30">
            <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-slate-400">
              AI Operations for Service Businesses
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-center mb-5"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="text-white">We Install AI Into Your Business.</span>
          <br />
          <span className="gradient-text-warm">It Handles the Rest.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-base sm:text-lg text-slate-400 text-center mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          OIOS handles your calls, runs your admin, and gives you a real-time command center —
          so you can focus on the actual work.
        </motion.p>

        {/* Animated Energy Network */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <EnergyNetwork />
        </motion.div>

        {/* 4-Column Capability Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon
            return (
              <motion.div
                key={cap.label}
                className={`group glass-card p-4 sm:p-5 border ${cap.border} ${cap.bg} transition-all duration-300`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-4 h-4 ${cap.color} ${cap.glow} transition-colors`} />
                  <span className={`text-[10px] font-mono font-bold tracking-[0.2em] ${cap.color}`}>
                    {cap.label}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {cap.items.map((item) => (
                    <li key={item} className="text-xs text-slate-400 flex items-start gap-1.5">
                      <span className={`mt-1.5 w-1 h-1 rounded-full ${cap.color} opacity-60 flex-shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Stat Bar */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-10 gap-y-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-6 sm:gap-10">
              <AnimatedStat value={stat.value} label={stat.label} />
              {i < stats.length - 1 && (
                <div className="hidden sm:block w-px h-8 bg-slate-700/50" />
              )}
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <MagneticButton>
            <Link
              href="#audit"
              data-glow
              data-cursor="cta"
              className="bg-gradient-to-r from-amber-500 to-amber-400 text-white px-10 py-4 rounded-lg font-semibold text-lg btn-glow hover:from-amber-600 hover:to-amber-500 transition-all duration-200"
            >
              Book Your Free Audit →
            </Link>
          </MagneticButton>
        </motion.div>

      </div>
    </section>
  )
}

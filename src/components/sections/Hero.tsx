'use client'

import Link from 'next/link'
import { useRef, useEffect } from 'react'
import { motion, useInView } from 'motion/react'
import { Phone, Target, Megaphone, Settings, DollarSign, HeartHandshake } from 'lucide-react'
import { FloatingPaths } from '@/components/ui/background-paths'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { SplineScene } from '@/components/ui/splite'
import { RotatingText } from '@/components/ui/RotatingText'
import { useScrollVelocity } from '@/hooks/useScrollVelocity'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'

// ─── Animated Energy Network SVG ────────────────────────────────────────────
function EnergyNetwork() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true })

  const nodes = [
    { id: 'receptionist', x: 120, y: 80, icon: '📞', color: '#34D399', label: 'RECEPTION' },
    { id: 'sales', x: 300, y: 50, icon: '🎯', color: '#F59E0B', label: 'SALES' },
    { id: 'marketing', x: 480, y: 80, icon: '📣', color: '#F472B6', label: 'MARKETING' },
    { id: 'operations', x: 120, y: 220, icon: '⚙️', color: '#2DD4BF', label: 'OPERATIONS' },
    { id: 'finance', x: 300, y: 250, icon: '💰', color: '#06B6D4', label: 'FINANCE' },
    { id: 'success', x: 480, y: 220, icon: '💜', color: '#A78BFA', label: 'SUCCESS' },
  ]

  const connections = [
    { from: 0, to: 1, d: 'M 150 85 Q 220 50 270 60' },
    { from: 1, to: 2, d: 'M 330 60 Q 400 50 450 85' },
    { from: 0, to: 3, d: 'M 130 105 Q 120 160 130 200' },
    { from: 2, to: 5, d: 'M 490 105 Q 490 160 490 200' },
    { from: 3, to: 4, d: 'M 150 230 Q 220 260 270 255' },
    { from: 4, to: 5, d: 'M 330 255 Q 400 260 450 230' },
    { from: 0, to: 4, d: 'M 145 100 Q 220 170 275 240' },
    { from: 1, to: 5, d: 'M 325 70 Q 410 150 470 205' },
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
    label: 'AI RECEPTIONIST',
    icon: Phone,
    color: 'text-emerald-400',
    border: 'border-emerald-400/20',
    glow: 'group-hover:text-emerald-300',
    bg: 'group-hover:bg-emerald-400/5',
    items: ['24/7 call answering', 'Appointment booking', 'Call transcripts', 'After-hours coverage'],
  },
  {
    label: 'AI SALES',
    icon: Target,
    color: 'text-amber-400',
    border: 'border-amber-400/20',
    glow: 'group-hover:text-amber-300',
    bg: 'group-hover:bg-amber-400/5',
    items: ['Lead scoring', 'Automated follow-ups', 'Proposal generation', 'Pipeline tracking'],
  },
  {
    label: 'AI MARKETING',
    icon: Megaphone,
    color: 'text-pink-400',
    border: 'border-pink-400/20',
    glow: 'group-hover:text-pink-300',
    bg: 'group-hover:bg-pink-400/5',
    items: ['Content creation', 'Social posting', 'Review requests', 'Campaign management'],
  },
  {
    label: 'AI OPERATIONS',
    icon: Settings,
    color: 'text-teal-400',
    border: 'border-teal-400/20',
    glow: 'group-hover:text-teal-300',
    bg: 'group-hover:bg-teal-400/5',
    items: ['CRM updates', 'Workflow automation', 'KPI dashboards', 'Morning briefings'],
  },
  {
    label: 'AI FINANCE',
    icon: DollarSign,
    color: 'text-cyan-400',
    border: 'border-cyan-400/20',
    glow: 'group-hover:text-cyan-300',
    bg: 'group-hover:bg-cyan-400/5',
    items: ['Revenue tracking', 'Expense alerts', 'Billing management', 'Weekly reports'],
  },
  {
    label: 'AI CLIENT SUCCESS',
    icon: HeartHandshake,
    color: 'text-violet-400',
    border: 'border-violet-400/20',
    glow: 'group-hover:text-violet-300',
    bg: 'group-hover:bg-violet-400/5',
    items: ['Client onboarding', 'Satisfaction tracking', 'Follow-ups', 'Upsell identification'],
  },
]

const stats = [
  { value: '6', label: 'AI Departments' },
  { value: '24/7', label: 'Operations' },
  { value: '0', label: 'Missed Leads' },
  { value: '$0', label: 'Additional Hires' },
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
              Your AI COO
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
          <span className="text-white">Your Entire Back Office.</span>
          <br />
          <RotatingText
            phrases={['Run by AI. 24/7.', 'Six AI Departments.', 'Zero Additional Hires.', 'One Platform.']}
            className="gradient-text-warm"
          />
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-base sm:text-lg text-slate-400 text-center mb-6 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          OIOS is a team of AI agents that runs operations for your service business — answering calls,
          managing leads, automating follow-ups, tracking revenue, and giving you real-time visibility
          into every part of your company. For a fraction of hiring cost.
        </motion.p>

        {/* Risk-reversal callout */}
        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-lg">🛡️</span>
            <span className="text-sm sm:text-base font-semibold text-emerald-400">
              Don&apos;t pay a dime until it pays for itself
            </span>
          </div>
        </motion.div>

        {/* Hero Robot Scene */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="relative mx-auto h-[280px] w-full max-w-[900px] overflow-hidden rounded-2xl border border-teal-400/20 bg-black/40 sm:h-[360px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.14),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(245,158,11,0.10),transparent_40%)]" />
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="h-full w-full"
            />
          </div>
          <div className="mt-6 hidden md:block">
            <EnergyNetwork />
          </div>
        </motion.div>

        {/* 4-Column Capability Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
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
              className="bg-gradient-to-r from-amber-500 to-amber-400 text-white px-6 sm:px-10 py-4 rounded-lg font-bold text-base sm:text-lg btn-glow hover:from-amber-600 hover:to-amber-500 transition-all duration-200 w-full sm:w-auto text-center"
            >
              Start Risk-Free →
            </Link>
          </MagneticButton>
        </motion.div>

      </div>
    </section>
  )
}

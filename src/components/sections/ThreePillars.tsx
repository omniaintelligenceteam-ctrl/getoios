'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

// ─── Pillar 1 SVG: Phone → AI picks up → Lead → Calendar → Text ───────────
function ReceptionistFlow() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const nodes = [
    { x: 30, y: 60, label: 'Incoming\nCall', color: '#F59E0B', icon: 'phone' },
    { x: 130, y: 60, label: 'AI Answers\n< 1 sec', color: '#2DD4BF', icon: 'ai' },
    { x: 230, y: 60, label: 'Lead\nCaptured', color: '#34D399', icon: 'check' },
    { x: 330, y: 60, label: 'Appt\nBooked', color: '#06B6D4', icon: 'cal' },
  ]

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg viewBox="0 0 380 120" className="w-full min-w-[320px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Connecting lines */}
        {nodes.slice(0, -1).map((node, i) => (
          <motion.line
            key={i}
            x1={node.x + 24} y1={node.y}
            x2={nodes[i + 1].x - 24} y2={nodes[i + 1].y}
            stroke="#2DD4BF"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.5 } : {}}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.3 }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.3 }}
          >
            <circle cx={node.x} cy={node.y} r="22" fill="rgba(15,23,42,0.8)" stroke={node.color} strokeWidth="1.5" strokeOpacity="0.6" />
            {/* Icon shorthand as text glyph */}
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="14" fill={node.color} fontFamily="monospace">
              {node.icon === 'phone' ? '📞' : node.icon === 'ai' ? '⚡' : node.icon === 'check' ? '✓' : '📅'}
            </text>
            {/* Label below */}
            {node.label.split('\n').map((line, li) => (
              <text key={li} x={node.x} y={node.y + 38 + li * 13} textAnchor="middle" fontSize="9" fill="#94A3B8" fontFamily="sans-serif">
                {line}
              </text>
            ))}
          </motion.g>
        ))}

        {/* "600ms" badge on second connector */}
        <motion.rect x="118" y="48" width="38" height="14" rx="4" fill="rgba(45,212,191,0.15)" stroke="rgba(45,212,191,0.3)" strokeWidth="1"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.9 }} />
        <motion.text x="137" y="58.5" textAnchor="middle" fontSize="8" fill="#2DD4BF" fontFamily="monospace"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.0 }}>
          {'< 1 sec'}
        </motion.text>
      </svg>
    </div>
  )
}

// ─── Pillar 2 SVG: Inbox → Proposal → CRM → Follow-up → Invoice ────────────
function BackOfficeFlow() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const nodes = [
    { x: 30, y: 60, label: 'New\nJob', color: '#F59E0B', glyph: '📥' },
    { x: 130, y: 60, label: 'Proposal\n30 sec', color: '#2DD4BF', glyph: '📄' },
    { x: 230, y: 60, label: 'CRM\nUpdated', color: '#34D399', glyph: '✓' },
    { x: 330, y: 60, label: 'Follow-up\nSent', color: '#06B6D4', glyph: '✉' },
  ]

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg viewBox="0 0 380 120" className="w-full min-w-[320px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        {nodes.slice(0, -1).map((node, i) => (
          <motion.line key={i} x1={node.x + 24} y1={node.y} x2={nodes[i + 1].x - 24} y2={nodes[i + 1].y}
            stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="4 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.5 } : {}}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.3 }} />
        ))}
        {nodes.map((node, i) => (
          <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.4, delay: i * 0.3 }}>
            <circle cx={node.x} cy={node.y} r="22" fill="rgba(15,23,42,0.8)" stroke={node.color} strokeWidth="1.5" strokeOpacity="0.6" />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="14" fill={node.color}>{node.glyph}</text>
            {node.label.split('\n').map((line, li) => (
              <text key={li} x={node.x} y={node.y + 38 + li * 13} textAnchor="middle" fontSize="9" fill="#94A3B8" fontFamily="sans-serif">{line}</text>
            ))}
          </motion.g>
        ))}
        {/* "30 sec" badge */}
        <motion.rect x="118" y="48" width="36" height="14" rx="4" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.3)" strokeWidth="1"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.9 }} />
        <motion.text x="136" y="58.5" textAnchor="middle" fontSize="8" fill="#F59E0B" fontFamily="monospace"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.0 }}>30 sec</motion.text>
      </svg>
    </div>
  )
}

// ─── Pillar 3 SVG: Morning briefing → Dashboard → Query → Alert ────────────
function CommandCenterFlow() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const nodes = [
    { x: 30, y: 60, label: '6:30 AM\nBriefing', color: '#F59E0B', glyph: '☀' },
    { x: 130, y: 60, label: 'Live\nDashboard', color: '#2DD4BF', glyph: '📊' },
    { x: 230, y: 60, label: 'NL\nQuery', color: '#34D399', glyph: '💬' },
    { x: 330, y: 60, label: 'Proactive\nAlert', color: '#06B6D4', glyph: '🔔' },
  ]

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg viewBox="0 0 380 120" className="w-full min-w-[320px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        {nodes.slice(0, -1).map((node, i) => (
          <motion.line key={i} x1={node.x + 24} y1={node.y} x2={nodes[i + 1].x - 24} y2={nodes[i + 1].y}
            stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="4 3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 0.5 } : {}}
            transition={{ duration: 0.6, delay: 0.3 + i * 0.3 }} />
        ))}
        {nodes.map((node, i) => (
          <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.4, delay: i * 0.3 }}>
            <circle cx={node.x} cy={node.y} r="22" fill="rgba(15,23,42,0.8)" stroke={node.color} strokeWidth="1.5" strokeOpacity="0.6" />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="14" fill={node.color}>{node.glyph}</text>
            {node.label.split('\n').map((line, li) => (
              <text key={li} x={node.x} y={node.y + 38 + li * 13} textAnchor="middle" fontSize="9" fill="#94A3B8" fontFamily="sans-serif">{line}</text>
            ))}
          </motion.g>
        ))}
      </svg>
    </div>
  )
}

// ─── Before / After cards ────────────────────────────────────────────────────
function BeforeAfter({ before, after }: { before: string; after: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-6">
      <div className="glass-card p-4 border-red-500/15">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-red-400/70 flex-shrink-0" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Before</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{before}</p>
      </div>
      <div className="glass-card p-4 border-teal-400/15">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-teal-400/70 flex-shrink-0" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">After</span>
        </div>
        <p className="text-xs text-white leading-relaxed">{after}</p>
      </div>
    </div>
  )
}

// ─── Single pillar block ─────────────────────────────────────────────────────
function Pillar({
  number, title, subtitle, description, bullets, flow, before, after, accent,
}: {
  number: string
  title: string
  subtitle: string
  description: string
  bullets: string[]
  flow: React.ReactNode
  before: string
  after: string
  accent: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
    >
      {/* Left — text */}
      <div>
        <div className="flex items-baseline gap-3 mb-4">
          <span className={`text-5xl font-bold ${accent} opacity-30 font-mono`}>{number}</span>
          <div>
            <div className={`text-xs font-mono uppercase tracking-[0.2em] ${accent} mb-1`}>{subtitle}</div>
            <h3 className="text-2xl lg:text-3xl font-bold text-white">{title}</h3>
          </div>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mb-5">{description}</p>
        <ul className="space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-slate-300">
              <span className={`w-1.5 h-1.5 rounded-full ${accent.replace('text-', 'bg-')} opacity-70 flex-shrink-0`} />
              {b}
            </li>
          ))}
        </ul>
        <BeforeAfter before={before} after={after} />
      </div>

      {/* Right — flow diagram */}
      <div className="glass-card p-6 lg:p-8">
        <div className={`text-[10px] font-mono uppercase tracking-[0.15em] ${accent} mb-6 opacity-70`}>Workflow</div>
        {flow}
      </div>
    </motion.div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function ThreePillars() {
  return (
    <section id="pillars" className="py-24 lg:py-32 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/30 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">What OIOS Does</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            <span className="text-white">Three Systems.</span>{' '}
            <span className="gradient-text">One Platform.</span>
          </h2>
        </motion.div>

        {/* Pillars */}
        <div className="space-y-24 lg:space-y-32">
          <Pillar
            number="01"
            subtitle="Pillar One"
            title="AI Receptionist"
            description="Every call answered in under a second. Leads captured, qualified, and booked — automatically. Your phone never goes to voicemail again."
            bullets={[
              '24/7 call answering — no hold music, no voicemail',
              'Lead capture, qualification, and scoring',
              'Appointment booking with calendar sync',
              'Confirmation texts sent to customers automatically',
              'Call transcripts + sentiment analysis',
            ]}
            flow={<ReceptionistFlow />}
            before="Calls go to voicemail. Leads ghost you before you can call back."
            after="Every call answered. Every lead captured. Calendar booked automatically."
            accent="text-teal-400"
          />

          <div className="section-divider" />

          <Pillar
            number="02"
            subtitle="Pillar Two"
            title="AI Back Office"
            description="Proposals in 30 seconds. Follow-ups sent automatically. CRM always current. The paperwork handles itself — you just approve."
            bullets={[
              'Proposals generated from templates in 30 seconds',
              'Automated follow-up sequences after quotes',
              'CRM updates without anyone touching it',
              'Email triage and response drafting',
              'Client onboarding sequences',
            ]}
            flow={<BackOfficeFlow />}
            before="You're doing the actual work AND all the admin. Something always slips."
            after="Paperwork handles itself. You review and approve. Nothing falls through."
            accent="text-amber-400"
          />

          <div className="section-divider" />

          <Pillar
            number="03"
            subtitle="Pillar Three"
            title="AI Command Center"
            description="Morning briefing at 6:30 AM. Real-time pipeline visibility. Ask OIOS anything about your business in plain English — it answers."
            bullets={[
              'Daily morning briefing via text',
              'Real-time pipeline and revenue dashboard',
              'Natural language queries: "How\'s my pipeline this week?"',
              'Proactive alerts on stalled deals',
              'Weekly performance report every Friday',
            ]}
            flow={<CommandCenterFlow />}
            before="You have no idea where things stand until something breaks."
            after="You know everything. OIOS keeps you briefed — without you having to ask."
            accent="text-cyan-400"
          />
        </div>

      </div>
    </section>
  )
}

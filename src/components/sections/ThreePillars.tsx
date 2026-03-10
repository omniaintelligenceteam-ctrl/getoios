'use client'

import Image from 'next/image'
import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

// ─── Pillar flow images ───────────────────────────────────────────────────────
function ReceptionistFlow() {
  return (
    <div className="w-full">
      <Image src="/flow-receptionist.jpg" alt="AI Receptionist workflow" width={1600} height={500} className="w-full h-auto rounded-lg" />
    </div>
  )
}

function BackOfficeFlow() {
  return (
    <div className="w-full">
      <Image src="/flow-backoffice.jpg" alt="AI Back Office workflow" width={1600} height={500} className="w-full h-auto rounded-lg" />
    </div>
  )
}

function CommandCenterFlow() {
  return (
    <div className="w-full">
      <Image src="/flow-command.jpg" alt="AI Command Center workflow" width={1600} height={500} className="w-full h-auto rounded-lg" />
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

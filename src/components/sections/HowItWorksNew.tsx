'use client'

import { useRef, useState, useEffect } from 'react'
import { useScroll, useTransform, motion, AnimatePresence } from 'motion/react'
import { CheckCircle2, Circle } from 'lucide-react'

// ─── Step 1 Visual: Animated checklist ───────────────────────────────────────
const auditItems = [
  'How calls are currently handled',
  'Where leads fall through the cracks',
  'Admin tasks eating your week',
  'Current tools and workflows',
  'Revenue leaks and missed follow-ups',
]

function AuditChecklist({ active }: { active: boolean }) {
  const [checked, setChecked] = useState<boolean[]>(auditItems.map(() => false))

  useEffect(() => {
    if (!active) {
      setChecked(auditItems.map(() => false))
      return
    }
    auditItems.forEach((_, i) => {
      setTimeout(() => {
        setChecked(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, i * 500 + 300)
    })
  }, [active])

  return (
    <div className="glass-card p-6 lg:p-8 space-y-4">
      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.15em] mb-6">Audit Scope</div>
      {auditItems.map((item, i) => (
        <motion.div
          key={item}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <AnimatePresence mode="wait">
            {checked[i] ? (
              <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ scale: 1 }} exit={{ scale: 0 }}>
                <Circle className="w-5 h-5 text-slate-600 flex-shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className={`text-sm transition-colors duration-300 ${checked[i] ? 'text-white' : 'text-slate-500'}`}>
            {item}
          </span>
        </motion.div>
      ))}
      <div className="pt-4 border-t border-slate-700/30 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-xs text-slate-400 font-mono">60-min session · no pitch</span>
        </div>
      </div>
    </div>
  )
}

// ─── Step 2 Visual: Config UI mock ───────────────────────────────────────────
const workflows = [
  { name: 'Call Answering', status: 'live', color: 'text-teal-400', dot: 'bg-teal-400' },
  { name: 'Lead Capture', status: 'live', color: 'text-teal-400', dot: 'bg-teal-400' },
  { name: 'Proposal Generator', status: 'live', color: 'text-teal-400', dot: 'bg-teal-400' },
  { name: 'Follow-Up Sequences', status: 'building', color: 'text-amber-400', dot: 'bg-amber-400' },
  { name: 'Morning Briefing', status: 'building', color: 'text-amber-400', dot: 'bg-amber-400' },
  { name: 'Weekly Report', status: 'queued', color: 'text-slate-500', dot: 'bg-slate-600' },
]

function ConfigMock({ active }: { active: boolean }) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (!active) { setVisibleCount(0); return }
    workflows.forEach((_, i) => {
      setTimeout(() => setVisibleCount(i + 1), i * 400 + 200)
    })
  }, [active])

  return (
    <div className="glass-card p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.15em]">OIOS Configuration</div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Building…
        </div>
      </div>
      <div className="space-y-3">
        {workflows.slice(0, visibleCount).map((wf, i) => (
          <motion.div
            key={wf.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-800/40 border border-slate-700/30"
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-1.5 h-1.5 rounded-full ${wf.dot} ${wf.status === 'building' ? 'animate-pulse' : ''}`} />
              <span className="text-xs text-slate-300">{wf.name}</span>
            </div>
            <span className={`text-[10px] font-mono ${wf.color}`}>{wf.status}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-slate-700/30 text-[10px] font-mono text-slate-600">
        Built with your data · your voice · your workflows
      </div>
    </div>
  )
}

// ─── Step 3 Visual: Telegram-style chat mock ──────────────────────────────────
const messages = [
  { from: 'oios', text: '☀ Good morning. Here\'s your 6:30 briefing:\n• 3 new leads overnight\n• 1 proposal stalled (Johnson HVAC — 5 days)\n• 2 jobs confirmed for today', delay: 0 },
  { from: 'owner', text: 'Follow up on that Johnson proposal', delay: 1200 },
  { from: 'oios', text: 'Done. Follow-up sent to Johnson HVAC. Want me to flag it again if no response by Friday?', delay: 2000 },
  { from: 'owner', text: 'Yes. Also send me the week\'s numbers', delay: 3000 },
  { from: 'oios', text: '📊 This week: $24,400 revenue · 8 jobs · 94% answer rate · 0 missed follow-ups', delay: 3800 },
]

function ChatMock({ active }: { active: boolean }) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (!active) { setVisibleCount(0); return }
    messages.forEach((msg, i) => {
      setTimeout(() => setVisibleCount(i + 1), msg.delay + 400)
    })
  }, [active])

  return (
    <div className="glass-card p-4 lg:p-6 flex flex-col" style={{ minHeight: '320px' }}>
      {/* Chat header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-700/30 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">O</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">OIOS</div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-hidden">
        {messages.slice(0, visibleCount).map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.from === 'owner' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
              msg.from === 'oios'
                ? 'bg-slate-700/60 text-slate-200 rounded-tl-sm'
                : 'bg-amber-500/20 border border-amber-500/30 text-amber-100 rounded-tr-sm'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-3 border-t border-slate-700/30 mt-3">
        <div className="text-[10px] font-mono text-slate-600 text-center">
          Your interface · Approve before anything reaches a customer
        </div>
      </div>
    </div>
  )
}

// ─── Step data ────────────────────────────────────────────────────────────────
const steps = [
  {
    number: '01',
    title: 'We Audit Your Business',
    description: 'We spend 60 minutes understanding your calls, admin, and workflows. No generic templates — we map the exact spots where time and money are leaking.',
    visual: (active: boolean) => <AuditChecklist active={active} />,
    accent: 'text-teal-400',
    accentBg: 'bg-teal-400',
  },
  {
    number: '02',
    title: 'We Build Your AI Operations Center',
    description: 'Your OIOS instance gets built with your business data, your voice, your workflows. Every automation is configured to match how you already work. Two weeks to live.',
    visual: (active: boolean) => <ConfigMock active={active} />,
    accent: 'text-amber-400',
    accentBg: 'bg-amber-400',
  },
  {
    number: '03',
    title: 'OIOS Runs 24/7. You Approve What Matters.',
    description: 'Nothing gets sent to a customer without your say-so. You text OIOS like you\'d text an assistant. It handles the rest and keeps you briefed.',
    visual: (active: boolean) => <ChatMock active={active} />,
    accent: 'text-cyan-400',
    accentBg: 'bg-cyan-400',
  },
]

// ─── Main export ──────────────────────────────────────────────────────────────
export function HowItWorksNew() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const rawStep = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 1, 2, 2])
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    return rawStep.on('change', (v) => {
      setActiveStep(Math.round(v))
    })
  }, [rawStep])

  return (
    <section id="how-it-works">
      {/* Mobile: vertical stacked layout */}
      <div className="lg:hidden py-24 bg-bg-secondary">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/30 mb-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">How It Works</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
              Audit. Build. <span className="gradient-text">Run.</span>
            </h2>
          </div>
          <div className="space-y-16">
            {steps.map((step, i) => (
              <div key={i}>
                <div className={`text-4xl font-bold font-mono ${step.accent} opacity-30 mb-3`}>{step.number}</div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{step.description}</p>
                {step.visual(true)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: pinned scroll */}
      <div
        ref={containerRef}
        className="hidden lg:block relative"
        style={{ height: '300vh' }}
      >
        <div className="sticky top-0 h-screen bg-bg-secondary flex items-center overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 w-full">
            <div className="grid grid-cols-2 gap-20 items-center">

              {/* Left panel — step info */}
              <div>
                {/* Section label */}
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/30 mb-10">
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">How It Works</span>
                </div>

                {/* Step progress dots */}
                <div className="flex items-center gap-3 mb-10">
                  {steps.map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-0.5 rounded-full bg-slate-700 overflow-hidden"
                      style={{ width: activeStep === i ? 32 : 12 }}
                      animate={{ width: activeStep === i ? 32 : 12 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className={`h-full ${i <= activeStep ? steps[activeStep].accentBg : 'bg-slate-700'}`}
                        style={{ width: '100%' }}
                      />
                    </motion.div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className={`text-6xl font-bold font-mono ${steps[activeStep].accent} opacity-20 mb-4`}>
                      {steps[activeStep].number}
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-5" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                      {steps[activeStep].title}
                    </h2>
                    <p className="text-slate-400 text-base leading-relaxed">
                      {steps[activeStep].description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Scroll hint */}
                <div className="mt-12 flex items-center gap-2 text-slate-600 text-xs font-mono">
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ↓
                  </motion.div>
                  Scroll to continue
                </div>
              </div>

              {/* Right panel — step visual */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 30, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -30, scale: 0.97 }}
                  transition={{ duration: 0.4 }}
                >
                  {steps[activeStep].visual(true)}
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

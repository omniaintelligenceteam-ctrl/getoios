'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

const objections = [
  {
    myth: 'Another app to learn',
    truth: 'You just text OIOS. It\'s like texting an assistant.',
    mythDetail: 'Another dashboard, another login, another thing to onboard your team on.',
    truthDetail: 'No interface to master. OIOS messages you. You reply. That\'s it.',
    mythIcon: '📱',
    truthIcon: '💬',
  },
  {
    myth: 'Another CRM to maintain',
    truth: 'OIOS IS the back office. It keeps itself updated.',
    mythDetail: 'You already have three tools nobody keeps current. This would make four.',
    truthDetail: 'Every call, job, and follow-up auto-logged. You never touch the CRM.',
    mythIcon: '🗃️',
    truthIcon: '🔄',
  },
  {
    myth: 'A chatbot with generic answers',
    truth: 'OIOS knows YOUR business — your clients, your prices, your workflows.',
    mythDetail: 'Generic AI that gives the same answer to every question, every business.',
    truthDetail: 'Built with your data during onboarding. It knows your jobs, your rates, your voice.',
    mythIcon: '🤖',
    truthIcon: '🧠',
  },
  {
    myth: 'Autonomous AI that goes rogue',
    truth: 'You approve everything before it reaches a customer. Full control, always.',
    mythDetail: 'AI sending emails, booking jobs, talking to clients — without your OK.',
    truthDetail: 'Nothing leaves without your sign-off. OIOS drafts. You decide. Simple.',
    mythIcon: '⚠️',
    truthIcon: '🛡️',
  },
]

function ObjectionCard({ item, index }: { item: typeof objections[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [revealed, setRevealed] = useState(false)

  // Reveal truth after myth shows
  if (inView && !revealed) {
    setTimeout(() => setRevealed(true), 800 + index * 150)
  }

  return (
    <motion.div
      ref={ref}
      className="glass-card p-6 lg:p-8 overflow-hidden relative"
      data-glow
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Myth section — dissolves away */}
      <motion.div
        className="mb-5 pb-5 border-b border-slate-700/30"
        animate={revealed ? { opacity: 0.4 } : { opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-start gap-3 mb-2">
          <motion.span
            className="w-7 h-7 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm"
            animate={revealed ? { scale: 0.8, opacity: 0.4 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {item.mythIcon}
          </motion.span>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-red-400/60 mb-1">What you might think</div>
            <p className="text-sm font-semibold text-slate-400 relative">
              {item.myth}
              {/* Strikethrough animation */}
              {revealed && (
                <motion.span
                  className="absolute left-0 top-1/2 h-px bg-red-400/50"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed pl-10">{item.mythDetail}</p>
      </motion.div>

      {/* Truth section — reveals with glow */}
      <motion.div
        className="flex items-start gap-3 relative"
        initial={{ opacity: 0, y: 10 }}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 10 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Subtle green glow behind truth */}
        {revealed && (
          <motion.div
            className="absolute -inset-3 rounded-lg bg-teal-400/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}
        <motion.span
          className="w-7 h-7 rounded-full bg-teal-400/15 border border-teal-400/25 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm relative z-10"
          animate={revealed ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          {item.truthIcon}
        </motion.span>
        <div className="relative z-10">
          <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-teal-400/70 mb-1">Reality</div>
          <p className="text-sm font-semibold text-white mb-2">{item.truth}</p>
          <motion.p
            className="text-xs text-slate-400 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={revealed ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {item.truthDetail}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function NotGetting() {
  return (
    <section id="not-getting" className="py-24 lg:py-32 bg-bg-secondary">
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
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">Let&apos;s Be Clear</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            <span className="text-white">What You&apos;re</span>
            <br />
            <span className="gradient-text-warm">NOT Getting</span>
          </h2>
          <p className="mt-5 text-slate-400 text-base max-w-xl mx-auto">
            AI has a reputation problem. Here&apos;s what OIOS actually is — and isn&apos;t.
          </p>
        </motion.div>

        {/* 2x2 Grid */}
        <div className="grid sm:grid-cols-2 gap-5 lg:gap-6 max-w-5xl mx-auto">
          {objections.map((item, i) => (
            <ObjectionCard key={i} item={item} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}

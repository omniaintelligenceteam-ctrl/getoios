'use client'

import { motion } from 'motion/react'

const objections = [
  {
    myth: 'Another app to learn',
    truth: 'You just text OIOS. It\'s like texting an assistant.',
    mythDetail: 'Another dashboard, another login, another thing to onboard your team on.',
    truthDetail: 'No interface to master. OIOS messages you. You reply. That\'s it.',
  },
  {
    myth: 'Another CRM to maintain',
    truth: 'OIOS IS the back office. It keeps itself updated.',
    mythDetail: 'You already have three tools nobody keeps current. This would make four.',
    truthDetail: 'Every call, job, and follow-up auto-logged. You never touch the CRM.',
  },
  {
    myth: 'A chatbot with generic answers',
    truth: 'OIOS knows YOUR business — your clients, your prices, your workflows.',
    mythDetail: 'Generic AI that gives the same answer to every question, every business.',
    truthDetail: 'Built with your data during onboarding. It knows your jobs, your rates, your voice.',
  },
  {
    myth: 'Autonomous AI that goes rogue',
    truth: 'You approve everything before it reaches a customer. Full control, always.',
    mythDetail: 'AI sending emails, booking jobs, talking to clients — without your OK.',
    truthDetail: 'Nothing leaves without your sign-off. OIOS drafts. You decide. Simple.',
  },
]

function ObjectionCard({ item, index }: { item: typeof objections[0]; index: number }) {
  return (
    <motion.div
      className="glass-card p-6 lg:p-8"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Myth */}
      <div className="mb-5 pb-5 border-b border-slate-700/30">
        <div className="flex items-start gap-3 mb-2">
          <span className="w-5 h-5 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-red-400 text-[10px] font-bold leading-none">✕</span>
          </span>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-500 mb-1">What you might think</div>
            <p className="text-sm font-semibold text-slate-400">{item.myth}</p>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed pl-8">{item.mythDetail}</p>
      </div>

      {/* Truth */}
      <div className="flex items-start gap-3">
        <span className="w-5 h-5 rounded-full bg-teal-400/15 border border-teal-400/25 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-teal-400 text-[10px] font-bold leading-none">✓</span>
        </span>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-500 mb-1">Reality</div>
          <p className="text-sm font-semibold text-white mb-2">{item.truth}</p>
          <p className="text-xs text-slate-400 leading-relaxed">{item.truthDetail}</p>
        </div>
      </div>
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
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">Let's Be Clear</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            <span className="text-white">What You're</span>
            <br />
            <span className="gradient-text-warm">NOT Getting</span>
          </h2>
          <p className="mt-5 text-slate-400 text-base max-w-xl mx-auto">
            AI has a reputation problem. Here's what OIOS actually is — and isn't.
          </p>
        </motion.div>

        {/* 2×2 Grid */}
        <div className="grid sm:grid-cols-2 gap-5 lg:gap-6 max-w-5xl mx-auto">
          {objections.map((item, i) => (
            <ObjectionCard key={i} item={item} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}

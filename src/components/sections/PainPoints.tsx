'use client'

import { motion, useInView } from 'motion/react'
import Image from 'next/image'
import { useRef } from 'react'

const timelineSteps = [
  {
    time: '7:15 AM',
    text: 'Phone rings while you\'re on a job. Goes to voicemail. Lead\'s gone by noon.',
    image: '/illustrations/pain-missed-call.png',
  },
  {
    time: '9:30 AM',
    text: 'You just remembered to follow up on that proposal from last week. Too late.',
    image: '/illustrations/pain-forgotten-followup.png',
  },
  {
    time: '11:00 AM',
    text: 'Another customer wants an ETA. You\'re elbow-deep in work. No one answers.',
    image: '/illustrations/pain-cant-answer.png',
  },
  {
    time: '2:00 PM',
    text: 'Your helper forgot to update the CRM. Now you don\'t know where three jobs stand.',
    image: '/illustrations/pain-crm-empty.png',
  },
  {
    time: '4:45 PM',
    text: 'End of day. You\'re exhausted. Tomorrow looks exactly the same.',
    image: '/illustrations/pain-exhausted.png',
  },
]

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
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={step.image}
              alt={step.text}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-slate-300 text-sm leading-relaxed pt-1">{step.text}</p>
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

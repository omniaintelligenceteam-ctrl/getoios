'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const events = [
  {
    time: '6:30 AM',
    name: 'Morning Briefing',
    description: '3 leads from yesterday. 1 proposal stalled. 2 callbacks needed. All before your first coffee.',
    accent: 'bg-amber-400',
    textAccent: 'text-amber-400',
    pulse: false,
  },
  {
    time: '9:00 AM',
    name: 'Follow-Up Check',
    description: 'Sending follow-up to 4 open proposals automatically. You don\'t lift a finger.',
    accent: 'bg-teal-400',
    textAccent: 'text-teal-400',
    pulse: false,
  },
  {
    time: '10:00 AM',
    name: 'Stale Deal Scan',
    description: 'Alert: Johnson HVAC quote hasn\'t moved in 5 days. Want me to follow up? You reply yes. Done.',
    accent: 'bg-cyan-400',
    textAccent: 'text-cyan-400',
    pulse: false,
  },
  {
    time: 'All Day',
    name: 'Inbound Call Handling',
    description: 'Every call answered in under 1 second. Every lead captured. You\'re on the job — OIOS has the phone.',
    accent: 'bg-emerald-400',
    textAccent: 'text-emerald-400',
    pulse: true,
  },
  {
    time: '5:00 PM',
    name: 'End of Day Wrap',
    description: 'Here\'s what happened today. 3 new leads. 1 job booked. 2 things need your approval. That\'s it.',
    accent: 'bg-teal-400',
    textAccent: 'text-teal-400',
    pulse: false,
  },
  {
    time: 'Friday',
    name: 'Weekly Performance Report',
    description: 'Revenue, pipeline, win rate, missed opportunities — all in one message. Every week, without asking.',
    accent: 'bg-amber-400',
    textAccent: 'text-amber-400',
    pulse: false,
  },
]

function TimelineEvent({
  event,
  index,
  isLast,
}: {
  event: typeof events[0]
  index: number
  isLast: boolean
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className="flex gap-5 lg:gap-8"
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {/* Timeline column */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Dot */}
        <div className="relative flex-shrink-0">
          <div className={`w-3 h-3 rounded-full ${event.accent} mt-1.5`} />
          {event.pulse && (
            <>
              <motion.div
                className={`absolute inset-0 rounded-full ${event.accent} opacity-40`}
                animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className={`absolute inset-0 rounded-full ${event.accent} opacity-25`}
                animate={{ scale: [1, 3], opacity: [0.25, 0] }}
                transition={{ duration: 1.5, delay: 0.3, repeat: Infinity }}
              />
            </>
          )}
        </div>
        {/* Connector line */}
        {!isLast && (
          <motion.div
            className="w-px flex-1 min-h-[48px] bg-gradient-to-b from-slate-600/60 to-transparent mt-2"
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.4, delay: index * 0.08 + 0.3 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="pb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${event.textAccent} border-current/30 bg-current/5`}>
            {event.time}
          </span>
          <span className="text-sm font-semibold text-white">{event.name}</span>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed max-w-lg">{event.description}</p>
      </div>
    </motion.div>
  )
}

export function DailySchedule() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section id="daily-schedule" className="py-24 lg:py-32 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/30 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">What OIOS Does Daily</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            <span className="text-white">A Day in the Life</span>
            <br />
            <span className="gradient-text">of Your AI Operations Partner</span>
          </h2>
          <p className="mt-5 text-slate-400 text-base max-w-xl mx-auto">
            While you're running the business, OIOS runs the back office. Here's what it does without you asking.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-2xl mx-auto lg:max-w-3xl">
          {events.map((event, i) => (
            <TimelineEvent
              key={event.name}
              event={event}
              index={i}
              isLast={i === events.length - 1}
            />
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-slate-500 text-sm font-mono">
            Every day. Automatically. Without a single reminder from you.
          </p>
        </motion.div>

      </div>
    </section>
  )
}

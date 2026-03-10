'use client'

import { motion } from 'motion/react'
import { FadeIn } from '@/components/ui/FadeIn'

const timelineSteps = [
  {
    time: '7:15 AM',
    text: 'Phone rings while you\'re on a job. Goes to voicemail. Lead\'s gone by noon.',
  },
  {
    time: '9:30 AM',
    text: 'You just remembered to follow up on that proposal from last week. Too late.',
  },
  {
    time: '11:00 AM',
    text: 'Another customer wants an ETA. You\'re elbow-deep in work. No one answers.',
  },
  {
    time: '2:00 PM',
    text: 'Your helper forgot to update the CRM. Now you don\'t know where three jobs stand.',
  },
  {
    time: '4:45 PM',
    text: 'End of day. You\'re exhausted. Tomorrow looks exactly the same.',
  },
]

function ChaosIllustration() {
  return (
    <div className="relative w-full max-w-sm mx-auto h-40 mb-14">
      {/* Connecting dotted line */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M60 80 Q130 30 160 80 Q190 130 260 80"
          stroke="rgba(239,68,68,0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Phone — ringing */}
      <motion.div
        className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
        animate={{ rotate: [0, -8, 8, -6, 6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
      >
        <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center relative">
          <svg className="w-6 h-6 text-amber-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {/* Ripple rings */}
          <motion.div
            className="absolute inset-0 rounded-xl border border-red-400/30"
            animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1.5 }}
          />
          <motion.div
            className="absolute inset-0 rounded-xl border border-red-400/20"
            animate={{ scale: [1, 2.0], opacity: [0.3, 0] }}
            transition={{ duration: 1, delay: 0.2, repeat: Infinity, repeatDelay: 1.5 }}
          />
        </div>
        <span className="text-[10px] text-slate-600 font-mono">missed</span>
      </motion.div>

      {/* Papers stacking */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
        <div className="relative w-12 h-14">
          {[3, 2, 1, 0].map((i) => (
            <motion.div
              key={i}
              className="absolute w-10 h-3 rounded-sm bg-slate-700/60 border border-slate-600/30"
              style={{ bottom: i * 5, left: i * 1 }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3, duration: 0.4, repeat: Infinity, repeatDelay: 2 }}
            />
          ))}
        </div>
        <span className="text-[10px] text-slate-600 font-mono">backlog</span>
      </div>

      {/* Clock spinning fast */}
      <motion.div
        className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/40 flex items-center justify-center">
          <svg className="w-7 h-7 text-amber-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2" />
          </svg>
        </div>
      </motion.div>
      <div className="absolute right-4 top-[calc(50%+32px)] text-[10px] text-slate-600 font-mono text-center w-12">
        no time
      </div>
    </div>
  )
}

export function PainPoints() {
  return (
    <section id="pain-points" className="py-24 lg:py-32 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
              <span className="text-white">Your Day</span>{' '}
              <span className="gradient-text-warm">Right Now</span>
            </h2>
            <p className="text-slate-500 text-base max-w-md mx-auto">
              If you run a service business, this is probably too familiar.
            </p>
          </div>
        </FadeIn>

        {/* Chaos illustration */}
        <FadeIn delay={100}>
          <ChaosIllustration />
        </FadeIn>

        {/* Timeline */}
        <div className="max-w-2xl mx-auto">
          <div className="space-y-0">
            {timelineSteps.map((step, index) => (
              <FadeIn key={index} delay={200 + index * 100}>
                <div className="flex gap-6">
                  {/* Timeline dot + connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-bold text-red-400/80 text-center leading-tight px-1">{step.time}</span>
                    </div>
                    {index < timelineSteps.length - 1 && (
                      <div className="w-px h-full min-h-[36px] bg-gradient-to-b from-red-500/20 to-transparent my-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="glass-card p-5 mb-4 flex-1 border-red-500/10">
                    <p className="text-slate-300 text-sm leading-relaxed">{step.text}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Closing line */}
        <FadeIn delay={800}>
          <div className="text-center mt-14">
            <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
              Sound familiar?{' '}
              <span className="gradient-text-warm font-semibold">It doesn&apos;t have to be.</span>
            </p>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
